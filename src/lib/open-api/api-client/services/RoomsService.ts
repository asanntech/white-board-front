/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateRoomDto } from '../models/CreateRoomDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class RoomsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Create a new room
     * @returns any Room created successfully
     * @throws ApiError
     */
    public createRoom({
        requestBody,
    }: {
        requestBody: CreateRoomDto,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/rooms',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
            },
        });
    }
}
