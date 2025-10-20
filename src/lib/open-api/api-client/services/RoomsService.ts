/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateRoomDto } from '../models/CreateRoomDto';
import type { GetRoomCreatorResponseDto } from '../models/GetRoomCreatorResponseDto';
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
    /**
     * Get creator userId of a room
     * @returns GetRoomCreatorResponseDto
     * @throws ApiError
     */
    public getRoomCreator({
        id,
    }: {
        id: string,
    }): CancelablePromise<GetRoomCreatorResponseDto> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/rooms/{id}/creator',
            path: {
                'id': id,
            },
            errors: {
                404: `Room not found`,
            },
        });
    }
}
