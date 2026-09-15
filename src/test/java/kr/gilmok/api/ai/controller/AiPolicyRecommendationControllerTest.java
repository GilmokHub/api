package kr.gilmok.api.ai.controller;

import kr.gilmok.api.ai.dto.AiPolicyRecommendationDto;
import kr.gilmok.api.ai.dto.ServerSpecRequest;
import kr.gilmok.api.ai.service.AiPolicyRecommendationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AiPolicyRecommendationController.class)
@AutoConfigureMockMvc(addFilters = false)
class AiPolicyRecommendationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AiPolicyRecommendationService aiService;

    @MockitoBean
    private kr.gilmok.api.token.interceptor.AdmissionTokenInterceptor admissionTokenInterceptor;

    @MockitoBean
    private kr.gilmok.api.queue.interceptor.QueueRateLimitInterceptor queueRateLimitInterceptor;

    @MockitoBean
    private kr.gilmok.api.policy.filter.PolicyFilter policyFilter;

    @Test
    @DisplayName("POST 요청 시 관리자용 AI 트래픽 정책 추천 결과를 반환한다")
    void getLiveAiRecommendation() throws Exception {
        // given
        Long eventId = 1L;
        Long mockAdminUserId = 1L;

        AiPolicyRecommendationDto mockResponse = new AiPolicyRecommendationDto(
                "DECREASE", 100, 50, "컨트롤러 테스트", null, null
        );

        given(aiService.getRecommendation(eq(eventId), eq(mockAdminUserId), any())).willReturn(mockResponse);

        // when & then
        mockMvc.perform(post("/admin/events/{eventId}/recommendation", eventId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}")
                        .header("X-User-Id", String.valueOf(mockAdminUserId))
                        .header("X-User-Role", "ADMIN"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.actionType").value("DECREASE"))
                .andExpect(jsonPath("$.data.recommendedAdmissionRps").value(100))
                .andExpect(jsonPath("$.data.rationale").value("컨트롤러 테스트"));
    }
}