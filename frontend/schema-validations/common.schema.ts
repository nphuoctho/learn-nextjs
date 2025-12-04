import z from 'zod';

export const MessageRes = z
  .object({
    message: z.string(),
  })
  .strict();

export type MessageResType = z.TypeOf<typeof MessageRes>;

// Error response types
export const FieldError = z.object({
  field: z.string(),
  message: z.string(),
});

export type FieldErrorType = z.TypeOf<typeof FieldError>;

export const ErrorPayload = z.object({
  message: z.string(),
  errors: z.array(FieldError).optional(),
  statusCode: z.number(),
});

export type ErrorPayloadType = z.TypeOf<typeof ErrorPayload>;

export const ErrorResponse = z.object({
  status: z.number(),
  payload: ErrorPayload,
});

export type ErrorResponseType = z.TypeOf<typeof ErrorResponse>;

// Success response types
export const SuccessPayload = z.object({
  message: z.string(),
  data: z.any().optional(), // Will be overridden by specific schemas
});

export type SuccessPayloadType = z.TypeOf<typeof SuccessPayload>;

export const SuccessResponse = z.object({
  status: z.number(),
  payload: SuccessPayload,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SuccessResponseType<T = any> = {
  status: number;
  payload: {
    message: string;
    data?: T;
  };
};
