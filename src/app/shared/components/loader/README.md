# Loader System Documentation

## Overview
The loader system provides a comprehensive set of loading indicators that match the project's color scheme and design patterns. It includes multiple loader types, sizes, colors, and usage patterns.

## Color Scheme
The loaders use the project's established color palette:
- **Primary**: `#4725a7` (main brand color)
- **Secondary**: `#e8e0ff` (light purple for hover states)
- **White**: `#fff` (for overlays and contrast)
- **Light**: `#f2eeff` (background color for selected states)

## Components

### 1. LoaderComponent
The main loader component that renders different types of loaders.

**Usage:**
```html
<app-loader
  [type]="'spinner'"
  [size]="'medium'"
  [color]="'primary'"
  [text]="'Loading...'"
  [overlay]="true"
  [fullScreen]="false">
</app-loader>
```

**Properties:**
- `type`: 'spinner' | 'dots' | 'pulse' | 'bars' | 'ripple' | 'skeleton'
- `size`: 'small' | 'medium' | 'large'
- `color`: 'primary' | 'secondary' | 'white' | 'light'
- `text`: string (optional loading text)
- `overlay`: boolean (shows overlay background)
- `fullScreen`: boolean (full screen overlay)

### 2. GlobalLoaderComponent
A wrapper component that listens to the LoaderService and displays the global loader.

**Usage:**
```html
<app-global-loader></app-global-loader>
```

### 3. LoaderService
Service for managing loader state globally.

**Methods:**
- `show(config?)`: Show loader with optional configuration
- `hide()`: Hide loader
- `showForRequest(config?)`: Show loader for HTTP requests
- `hideForRequest()`: Hide loader for HTTP requests
- `showWithText(text, config?)`: Show loader with text
- `showFullScreen(text?, config?)`: Show full screen loader
- `showInline(config?)`: Show inline loader (no overlay)
- `isLoading()`: Check if loader is currently showing
- `getConfig()`: Get current loader configuration
- `resetRequests()`: Reset active requests counter

## Loader Types

### 1. Spinner
Classic rotating spinner animation.
```typescript
this.loaderService.show({ type: 'spinner' });
```

### 2. Dots
Three bouncing dots animation.
```typescript
this.loaderService.show({ type: 'dots' });
```

### 3. Pulse
Pulsing circle animation.
```typescript
this.loaderService.show({ type: 'pulse' });
```

### 4. Bars
Animated bars (like audio equalizer).
```typescript
this.loaderService.show({ type: 'bars' });
```

### 5. Ripple
Ripple effect animation.
```typescript
this.loaderService.show({ type: 'ripple' });
```

### 6. Skeleton
Skeleton loading animation for content placeholders.
```typescript
this.loaderService.show({ type: 'skeleton' });
```

## Usage Examples

### Basic Usage
```typescript
import { LoaderService } from './shared/services/loader.service';

constructor(private loaderService: LoaderService) {}

// Show loader
this.loaderService.show();

// Hide loader
this.loaderService.hide();
```

### Custom Configuration
```typescript
// Show spinner with custom text
this.loaderService.show({
  type: 'spinner',
  size: 'large',
  color: 'primary',
  text: 'Processing your request...',
  overlay: true,
  fullScreen: false
});
```

### HTTP Request Loading
```typescript
// Show loader for HTTP request
this.loaderService.showForRequest({
  type: 'spinner',
  text: 'Loading data...'
});

// The loader will automatically hide when the request completes
```

### Full Screen Loading
```typescript
// Show full screen loader
this.loaderService.showFullScreen('Please wait...', {
  type: 'spinner',
  size: 'large',
  color: 'primary'
});
```

### Inline Loading
```typescript
// Show inline loader (no overlay)
this.loaderService.showInline({
  type: 'dots',
  size: 'small',
  color: 'primary',
  text: 'Saving...'
});
```

## Integration with HTTP Interceptor

The system includes an HTTP interceptor that automatically shows loaders for HTTP requests:

```typescript
// In app.module.ts
providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: LoadingInterceptorService,
    multi: true
  }
]
```

## Styling

All loaders use CSS animations and are fully responsive. The styles are defined in `loader.component.scss` and follow the project's design system.

### Custom Styling
You can override loader styles by targeting the appropriate CSS classes:

```scss
// Custom spinner color
.loader-primary .spinner-loader .spinner {
  border-color: #your-color transparent #your-color transparent;
}

// Custom size
.loader-large .spinner-loader .spinner {
  width: 80px;
  height: 80px;
}
```

## Best Practices

1. **Use appropriate loader types**: Choose the loader type that best fits your use case
2. **Provide meaningful text**: Always include descriptive text for better UX
3. **Consider loading duration**: Use different sizes based on expected loading time
4. **Handle errors gracefully**: Always hide loaders in error scenarios
5. **Use HTTP interceptor**: Let the interceptor handle HTTP request loading automatically

## Testing

The loader system includes comprehensive unit tests for all components and services. Run tests with:

```bash
ng test
```

## Demo

Visit `/loader-examples` route to see all loader types and configurations in action.
