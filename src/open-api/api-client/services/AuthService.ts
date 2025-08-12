/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthVerifyRequestDto } from '../models/AuthVerifyRequestDto';
import type { AuthVerifyResponseDto } from '../models/AuthVerifyResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AuthService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Verify Token
     * @returns AuthVerifyResponseDto
     * @throws ApiError
     */
    public verify({
        requestBody,
    }: {
        requestBody: AuthVerifyRequestDto,
    }): CancelablePromise<AuthVerifyResponseDto> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/verify',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
