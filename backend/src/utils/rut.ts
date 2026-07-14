import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

const RUT_REGEX = /^\d{7,8}-[\dkK]$/;

export function normalizarRut(rut: string): string {
  return rut.trim().replace(/\./g, '').toLowerCase();
}

export function esRutValido(rut: string): boolean {
  if (typeof rut !== 'string') return false;
  const normalizado = normalizarRut(rut);
  if (!RUT_REGEX.test(normalizado)) return false;

  const [cuerpo, dv] = normalizado.split('-');
  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = 11 - (suma % 11);
  const dvEsperado = resto === 11 ? '0' : resto === 10 ? 'k' : String(resto);

  return dv === dvEsperado;
}

export function IsRut(options?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsRut',
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(value: unknown) {
          return typeof value === 'string' && esRutValido(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} debe ser un RUT chileno válido (ej: 12345678-9)`;
        },
      },
    });
  };
}
