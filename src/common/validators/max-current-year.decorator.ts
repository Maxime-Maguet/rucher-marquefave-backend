import { registerDecorator, ValidationOptions } from 'class-validator';

/** Évalue l'année au moment de la requête, pas au chargement du module. */
export function MaxCurrentYear(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'maxCurrentYear',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          return (
            typeof value === 'number' &&
            Number.isInteger(value) &&
            value <= new Date().getFullYear()
          );
        },
        defaultMessage() {
          return '$property must not be greater than the current year';
        },
      },
    });
  };
}
