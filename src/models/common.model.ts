export interface Message {
    error?: string;
    message?: string;
    statusCode?: number;
}

export interface ResponseData<T> {
    data?: T;
    messsage?: Message,
    statusCode?: number,
}

export interface Error {
    data: ResponseData<any>,
    status: number;
}

export interface DataResponse<T> {
    error?: Error;
    statusCode?: number;
    message?: Message;
    data?: T;
};