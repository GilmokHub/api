package kr.gilmok.platform.queue.dto;

import kr.gilmok.platform.queue.QueueStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class QueueStatusResponse {
    private final QueueStatus status;
    private final long position;
    private final long total;
    private final long etaSeconds;
    private final long pollAfterMs;
    private final String admissionToken;

    public long getRank() {
        return position;
    }

    public long getExpectedWaitSeconds() {
        return etaSeconds;
    }

    public String getToken() {
        return admissionToken;
    }
}
