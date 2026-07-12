package dev.cleat.common.exception;

public class FeedSyncException extends RuntimeException {
    public FeedSyncException(String msg) {
        super(msg);
    }

    public FeedSyncException(String msg, Throwable cause) {
        super(msg, cause);
    }
}
