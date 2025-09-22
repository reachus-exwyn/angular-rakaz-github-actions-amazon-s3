import { Component, ElementRef, NgZone, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

declare const google: any;

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss']
})
export class LocationPickerComponent implements OnInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  map!: google.maps.Map;
  marker!: google.maps.Marker;
  markerPosition = { lat: 25.276987, lng: 55.296249 }; // Dubai default
  zoom = 12;
  autocomplete: any;
  private observer: MutationObserver | null = null;
  private inputListeners: Array<() => void> = [];
  private autocompleteListeners: Array<() => void> = [];

  constructor(public activeModal: NgbActiveModal, private ngZone: NgZone) {}

  ngOnInit(): void {
    console.log('LocationPickerComponent initialized');
    console.log('Window google object:', window['google']);
    console.log('Google maps available:', !!window['google']?.maps);
    console.log('Google places available:', !!window['google']?.maps?.places);
    
    // Check if the script tag is loaded
    const scriptTags = document.querySelectorAll('script[src*="maps.googleapis.com"]');
    console.log('Google Maps script tags found:', scriptTags.length);
    scriptTags.forEach((tag, index) => {
      const src = (tag as HTMLScriptElement).src;
      console.log(`Script ${index}:`, src);
      
      // Extract API key from script src
      const keyMatch = src.match(/key=([^&]+)/);
      if (keyMatch) {
        console.log('API Key found:', keyMatch[1]);
        console.log('API Key length:', keyMatch[1].length);
      }
    });
    
    // Clean up any existing instances
    this.cleanup();
    
    // Set up MutationObserver to watch for PAC container creation
    this.setupDropdownWatcher();
    
    this.waitForGoogle().then(() => {
      console.log('Google Maps API loaded successfully');
      this.initMap();
    }).catch(error => {
      console.error('Failed to load Google Maps API:', error);
      this.showErrorMessage('Failed to load Google Maps API. Please check your API key and internet connection.');
    });
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  // Watch for when Google creates the PAC container and make it visible
  setupDropdownWatcher() {
    // Clean up any existing observer
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.classList && element.classList.contains('pac-container')) {
                console.log('🎯 PAC container detected! Making it visible...');
                setTimeout(() => this.ensureDropdownVisible(), 50);
              }
            }
          });
        }
      });
    });

    // Start observing the document body for changes
    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    console.log('✅ MutationObserver set up to watch for PAC container');
  }

  waitForGoogle(): Promise<void> {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max wait
      
      const check = () => {
        attempts++;
        console.log(`Checking Google Maps API... Attempt ${attempts}`);
        
        if (window['google'] && window['google'].maps && window['google'].maps.places) {
          console.log('Google Maps API is available');
          resolve();
        } else if (attempts >= maxAttempts) {
          const error = new Error('Google Maps API failed to load after 5 seconds. Please check your API key and ensure the Places API is enabled.');
          console.error(error.message);
          reject(error);
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }

  showErrorMessage(message: string) {
    console.error(message);
    // You can add a toast notification here if you have a toast service
    alert(message); // Temporary fallback
  }

  initMap() {
    try {
      console.log('Initializing map...');
      
      this.map = new google.maps.Map(this.mapContainer.nativeElement, {
        center: this.markerPosition,
        zoom: this.zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      console.log('Map created successfully');

      this.marker = new google.maps.Marker({
        position: this.markerPosition,
        map: this.map,
        draggable: true
      });

      console.log('Marker created successfully');

      // Add map click listener to update marker position
      this.map.addListener('click', (event: any) => {
        console.log('Map clicked at:', event.latLng);
        this.updateMarkerPosition(event.latLng);
        this.reverseGeocode(event.latLng);
      });

      // Initialize Places Autocomplete
      this.initAutocomplete();
      
      // Add marker drag listener
      this.marker.addListener('dragend', () => {
        const position = this.marker.getPosition();
        if (position) {
          this.markerPosition = {
            lat: position.lat(),
            lng: position.lng()
          };
          console.log('Marker dragged to:', this.markerPosition);
          // Reverse geocode the new position
          this.reverseGeocode(position);
        }
      });

    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  // Update marker position and markerPosition
  updateMarkerPosition(latLng: google.maps.LatLng) {
    this.marker.setPosition(latLng);
    this.markerPosition = {
      lat: latLng.lat(),
      lng: latLng.lng()
    };
    console.log('Marker position updated to:', this.markerPosition);
  }

  // Reverse geocode coordinates to get address
  reverseGeocode(latLng: google.maps.LatLng) {
    console.log('Reverse geocoding coordinates:', latLng.lat(), latLng.lng());
    
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results: any[], status: any) => {
      if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
        const result = results[0];
        const address = result.formatted_address;
        console.log('Reverse geocoded address:', address);
        
        // Update the search input with the address
        this.ngZone.run(() => {
          this.searchInput.nativeElement.value = address;
          console.log('Search input updated with address:', address);
        });
      } else {
        console.warn('Reverse geocoding failed:', status);
        // If reverse geocoding fails, just show coordinates
        const coordString = `${latLng.lat().toFixed(6)}, ${latLng.lng().toFixed(6)}`;
        this.ngZone.run(() => {
          this.searchInput.nativeElement.value = coordString;
          console.log('Search input updated with coordinates:', coordString);
        });
      }
    });
  }

  initAutocomplete() {
    try {
      console.log('Initializing Places Autocomplete...');
      console.log('Search input element:', this.searchInput.nativeElement);
      console.log('Search input value:', this.searchInput.nativeElement.value);
      
      // Clean up any existing autocomplete
      if (this.autocomplete) {
        google.maps.event.clearInstanceListeners(this.autocomplete);
        this.autocomplete = null;
      }
      
      // Create autocomplete with specific options
      this.autocomplete = new google.maps.places.Autocomplete(this.searchInput.nativeElement, {
        types: ['geocode', 'establishment'],
        componentRestrictions: { country: 'AE' } // Restrict to UAE
      });

      console.log('Autocomplete object created:', this.autocomplete);

      // Test if autocomplete is working by triggering a prediction
      setTimeout(() => {
        console.log('Testing autocomplete dropdown visibility...');
        this.searchInput.nativeElement.focus();
        this.searchInput.nativeElement.value = 'Dubai';
        this.searchInput.nativeElement.dispatchEvent(new Event('input'));
        
        // Check if dropdown appears
        setTimeout(() => {
          const pacContainer = document.querySelector('.pac-container');
          console.log('PAC container found:', pacContainer);
          if (pacContainer) {
            console.log('PAC container styles:', window.getComputedStyle(pacContainer));
            console.log('PAC container z-index:', window.getComputedStyle(pacContainer).zIndex);
          }
        }, 1000);
      }, 500);

      // Bind to map bounds
      const boundsListener = this.autocomplete.addListener('bounds_changed', () => {
        console.log('Bounds changed, ensuring dropdown visibility');
        this.ensureDropdownVisible();
      });
      this.autocompleteListeners.push(() => google.maps.event.removeListener(boundsListener));

      // Add place_changed listener
      const placeChangedListener = this.autocomplete.addListener('place_changed', () => {
        console.log('Place selected from autocomplete');
        
        this.ngZone.run(() => {
          const place = this.autocomplete.getPlace();
          console.log('Selected place:', place);
          
          if (!place.geometry || !place.geometry.location) {
            console.warn('Place has no geometry');
            return;
          }

          const location = place.geometry.location;
          console.log('Place location:', { lat: location.lat(), lng: location.lng() });

          // Update map and marker
          this.map.setCenter(location);
          this.map.setZoom(16);
          this.marker.setPosition(location);

          this.markerPosition = {
            lat: location.lat(),
            lng: location.lng()
          };

          console.log('Updated marker position:', this.markerPosition);
        });
      });
      this.autocompleteListeners.push(() => google.maps.event.removeListener(placeChangedListener));

      // Add input event listener to ensure dropdown visibility
      const inputListener = () => {
        console.log('Input event triggered, ensuring dropdown visibility');
        setTimeout(() => this.ensureDropdownVisible(), 100);
      };
      this.searchInput.nativeElement.addEventListener('input', inputListener);
      this.inputListeners.push(() => this.searchInput.nativeElement.removeEventListener('input', inputListener));

      // Add focus event listener
      const focusListener = () => {
        console.log('Input focused, ensuring dropdown visibility');
        setTimeout(() => this.ensureDropdownVisible(), 100);
      };
      this.searchInput.nativeElement.addEventListener('focus', focusListener);
      this.inputListeners.push(() => this.searchInput.nativeElement.removeEventListener('focus', focusListener));

      console.log('Places Autocomplete initialized successfully');
      
    } catch (error) {
      console.error('Error initializing Places Autocomplete:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.showErrorMessage(`Failed to initialize Places Autocomplete: ${errorMessage}`);
    }
  }

  // Force the dropdown to be visible
  ensureDropdownVisible() {
    const pacContainer = document.querySelector('.pac-container');
    if (pacContainer) {
      console.log('🎯 Making PAC container visible...');
      
      // Force display block and remove aria-hidden
      (pacContainer as HTMLElement).style.setProperty('display', 'block', 'important');
      pacContainer.removeAttribute('aria-hidden');
      
      // Ensure proper positioning and z-index
      (pacContainer as HTMLElement).style.setProperty('z-index', '9999', 'important');
      (pacContainer as HTMLElement).style.setProperty('position', 'fixed', 'important');
      (pacContainer as HTMLElement).style.setProperty('visibility', 'visible', 'important');
      (pacContainer as HTMLElement).style.setProperty('opacity', '1', 'important');
      
      // Remove any inline styles that might hide it
      (pacContainer as HTMLElement).style.removeProperty('display');
      (pacContainer as HTMLElement).style.removeProperty('visibility');
      (pacContainer as HTMLElement).style.removeProperty('opacity');
      
      // Force it to be visible again
      (pacContainer as HTMLElement).style.setProperty('display', 'block', 'important');
      
      console.log('✅ Forced dropdown to be visible');
      
      // Double-check after a short delay
      setTimeout(() => {
        const computedStyle = window.getComputedStyle(pacContainer);
        console.log('Final dropdown styles:', {
          display: computedStyle.display,
          visibility: computedStyle.visibility,
          zIndex: computedStyle.zIndex,
          position: computedStyle.position
        });
      }, 100);
    } else {
      console.log('No PAC container found to make visible');
    }
  }

  confirmLocation() {
    console.log('Confirming location:', this.markerPosition);
    this.activeModal.close(this.markerPosition);
  }

  // Test method to verify Places API
  testPlacesAPI() {
    console.log('Testing Places API...');
    console.log('Google object available:', !!window['google']);
    console.log('Google maps available:', !!window['google']?.maps);
    console.log('Google places available:', !!window['google']?.maps?.places);
    
    if (this.autocomplete) {
      console.log('Autocomplete object:', this.autocomplete);
      console.log('Search input element:', this.searchInput.nativeElement);
      
      // Test if we can get predictions
      try {
        const service = new google.maps.places.AutocompleteService();
        console.log('AutocompleteService created:', service);
        
        service.getPlacePredictions({
          input: 'Dubai',
          types: ['geocode']
        }, (predictions: any[], status: any) => {
          console.log('Predictions status:', status);
          console.log('Predictions:', predictions);
          
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            console.log('Places API is working correctly!');
          } else {
            console.error('Places API error status:', status);
            this.showErrorMessage(`Places API error: ${status}`);
          }
        });
      } catch (error) {
        console.error('Error testing Places API:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.showErrorMessage(`Error testing Places API: ${errorMessage}`);
      }
    } else {
      console.error('Autocomplete not initialized');
      this.showErrorMessage('Autocomplete not initialized. Please check the console for errors.');
    }
  }

  // Test the API key directly
  testAPIKey() {
    console.log('=== API Key Test ===');
    
    // Check if the script is loaded
    const scriptTags = document.querySelectorAll('script[src*="maps.googleapis.com"]');
    console.log('Google Maps script tags found:', scriptTags.length);
    scriptTags.forEach((tag, index) => {
      const src = (tag as HTMLScriptElement).src;
      console.log(`Script ${index}:`, src);
      
      // Extract API key from script src
      const keyMatch = src.match(/key=([^&]+)/);
      if (keyMatch) {
        console.log('API Key found:', keyMatch[1]);
        console.log('API Key length:', keyMatch[1].length);
      }
    });
    
    // Check Google object
    console.log('Window google object:', window['google']);
    console.log('Google maps available:', !!window['google']?.maps);
    console.log('Google places available:', !!window['google']?.maps?.places);
    
    // Test basic map functionality
    if (window['google']?.maps) {
      try {
        const testMap = new google.maps.Map(document.createElement('div'), {
          center: { lat: 0, lng: 0 },
          zoom: 1
        });
        console.log('✅ Basic map creation works');
      } catch (error) {
        console.error('❌ Basic map creation failed:', error);
      }
    }
    
    // Test Places API directly
    if (window['google']?.maps?.places) {
      try {
        const testService = new google.maps.places.AutocompleteService();
        console.log('✅ Places AutocompleteService creation works');
        
        // Test a simple prediction
        testService.getPlacePredictions({
          input: 'Test',
          types: ['geocode']
        }, (predictions: any[], status: any) => {
          console.log('Places API test result - Status:', status);
          console.log('Places API test result - Predictions count:', predictions?.length || 0);
          
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            console.log('✅ Places API is working correctly!');
          } else if (status === google.maps.places.PlacesServiceStatus.REQUEST_DENIED) {
            console.error('❌ Places API request denied - Check API key and billing');
            this.showErrorMessage('Places API request denied. Please check your API key and ensure billing is enabled.');
          } else if (status === google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
            console.error('❌ Places API quota exceeded');
            this.showErrorMessage('Places API quota exceeded. Please check your billing and usage limits.');
          } else if (status === google.maps.places.PlacesServiceStatus.INVALID_REQUEST) {
            console.error('❌ Places API invalid request');
            this.showErrorMessage('Places API invalid request. Please check your request parameters.');
          } else {
            console.error('❌ Places API error:', status);
            this.showErrorMessage(`Places API error: ${status}`);
          }
        });
      } catch (error) {
        console.error('❌ Places API test failed:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.showErrorMessage(`Places API test failed: ${errorMessage}`);
      }
    } else {
      console.error('❌ Places API not available');
      this.showErrorMessage('Places API not available. Please check if the Google Maps script loaded correctly.');
    }
  }

  // Test autocomplete dropdown visibility
  testAutocompleteDropdown() {
    console.log('=== Testing Autocomplete Dropdown ===');
    
    if (!this.autocomplete) {
      console.error('❌ Autocomplete not initialized');
      return;
    }
    
    console.log('✅ Autocomplete is initialized');
    
    // Focus the input and type something
    this.searchInput.nativeElement.focus();
    this.searchInput.nativeElement.value = 'Dubai';
    this.searchInput.nativeElement.dispatchEvent(new Event('input'));
    
    console.log('Input focused and value set to "Dubai"');
    
    // Check for dropdown after a short delay
    setTimeout(() => {
      const pacContainer = document.querySelector('.pac-container');
      console.log('PAC container found:', pacContainer);
      
      if (pacContainer) {
        const styles = window.getComputedStyle(pacContainer);
        console.log('✅ PAC container found with styles:', {
          display: styles.display,
          visibility: styles.visibility,
          zIndex: styles.zIndex,
          position: styles.position,
          top: styles.top,
          left: styles.left,
          width: styles.width,
          height: styles.height,
          backgroundColor: styles.backgroundColor
        });
        
        // Check if dropdown has items
        const pacItems = pacContainer.querySelectorAll('.pac-item');
        console.log('PAC items found:', pacItems.length);
        
        if (pacItems.length > 0) {
          console.log('✅ Autocomplete dropdown is working and visible!');
        } else {
          console.warn('⚠️ PAC container found but no items inside');
        }
      } else {
        console.error('❌ PAC container not found - dropdown may be hidden');
        
        // Check if there are any hidden PAC containers
        const allPacContainers = document.querySelectorAll('[class*="pac"]');
        console.log('All PAC-related elements found:', allPacContainers);
      }
    }, 1000);
  }

  // Reinitialize autocomplete (useful when modal is reopened)
  reinitializeAutocomplete() {
    console.log('🔄 Reinitializing autocomplete...');
    this.cleanup();
    this.setupDropdownWatcher();
    this.initAutocomplete();
    console.log('✅ Autocomplete reinitialized');
  }

  // Get current user location
  getCurrentLocation() {
    console.log('Getting current location...');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Current position obtained:', position);
          const latLng = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          
          // Update map center and marker
          this.map.setCenter(latLng);
          this.map.setZoom(15);
          this.updateMarkerPosition(latLng);
          this.reverseGeocode(latLng);
          
          console.log('✅ Current location set successfully');
        },
        (error) => {
          console.error('Error getting current location:', error);
          let errorMessage = 'Unable to get current location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location access.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          
          this.showErrorMessage(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      console.error('Geolocation not supported');
      this.showErrorMessage('Geolocation is not supported by this browser.');
    }
  }

  // Clean up all listeners and observers
  private cleanup() {
    console.log('🧹 Cleaning up component...');
    
    // Disconnect MutationObserver
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
      console.log('✅ MutationObserver disconnected');
    }
    
    // Remove input event listeners
    this.inputListeners.forEach(listener => listener());
    this.inputListeners = [];
    console.log('✅ Input event listeners removed');
    
    // Remove autocomplete listeners
    this.autocompleteListeners.forEach(listener => listener());
    this.autocompleteListeners = [];
    console.log('✅ Autocomplete listeners removed');
    
    // Clear autocomplete instance
    if (this.autocomplete) {
      google.maps.event.clearInstanceListeners(this.autocomplete);
      this.autocomplete = null;
      console.log('✅ Autocomplete instance cleared');
    }
    
    // Remove any existing PAC containers
    const pacContainers = document.querySelectorAll('.pac-container');
    pacContainers.forEach(container => container.remove());
    console.log('✅ Existing PAC containers removed');
  }
}
