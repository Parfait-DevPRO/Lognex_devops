package com.lognex.backend.exception;

public class InvalidLogDataException extends RuntimeException {
    public InvalidLogDataException(String message) {
        super(message);
    }
}
