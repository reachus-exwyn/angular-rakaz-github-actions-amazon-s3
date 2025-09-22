import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const thresholdAndIndexValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const minThreshold = group.get('minThreshold')?.value;
    const maxThreshold = group.get('maxThreshold')?.value;
    const indexStart = group.get('indexStart')?.value;
    const indexEnd = group.get('indexEnd')?.value;
  
    const errors: any = {};
  
    // Validate threshold only if both are entered
    if (
      minThreshold !== null && minThreshold !== '' &&
      maxThreshold !== null && maxThreshold !== ''
    ) {
      if (+maxThreshold <= +minThreshold) {
        errors.maxThreshold = 'Max Threshold must be greater than Min Threshold';
      }
    }
  
    // Validate index only if both are entered
    if (
      indexStart !== null && indexStart !== '' &&
      indexEnd !== null && indexEnd !== ''
    ) {
      if (+indexEnd <= +indexStart) {
        errors.indexEnd = 'Index End must be greater than Index Start';
      }
    }
  
    return Object.keys(errors).length ? errors : null;
  };
  
  