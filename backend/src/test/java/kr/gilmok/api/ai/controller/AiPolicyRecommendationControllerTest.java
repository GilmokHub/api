package kr.gilmok.api.ai.controller;

import kr.gilmok.api.ai.dto.AiPolicyRecommendationDto;
import kr.gilmok.api.ai.service.AiPolicyRecommendationService;
import kr.gilmok.api.global.dto.AuthUserDto;
import kr.gilmok.api.global.security.CustomUserDetails;
import kr.gilmok.api.global.security.JwtAuthenticationFilter;

import kr.gilmok.api.queue.interceptor.QueueRateLimitInterceptor;
import kr.gilmok.api.token.interceptor.AdmissionTokenInterceptor;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = AiPolicyRecommendationController.class,
        excludeFilters = @ComponentScan.Filter(
                type = FilterType.ASSIGNABLE_TYPE,
                classes = {
                        kr.gilmok.api.config.SecurityConfig.class,
                        kr.gilmok.api.config.WebMvcConfig.class,
                        kr.gilmok.api.policy.filter.PolicyFilter.class,
                        JwtAuthenticationFilter.class,
                        QueueRateLimitInterceptor.class,
                        AdmissionTokenInterceptor.class,
                        kr.gilmok.api.queue.filter.QueueLoggingFilter.class
                }
        ))
@AutoConfigureMockMvc(addFilters = false)
class AiPolicyRecommendationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AiPolicyRecommendationService aiService;

    @Test
    @DisplayName("POST 요청 시 관리자용 AI 트래픽 정책 추천 결과를 반환한다")
    void getLiveAiRecommendation() throws Exception {
        // given
        Long eventId = 1L;
        Long mockAdminUserId = 1L;

        CustomUserDetails mockUserDetails = new CustomUserDetails(
                new AuthUserDto(mockAdminUserId, "admin", "pwd", "ROLE_ADMIN", "ACTIVE")
        );
        org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                        mockUserDetails, null, mockUserDetails.getAuthorities()
                )
        );

        AiPolicyRecommendationDto mockResponse = new AiPolicyRecommendationDto(
                "DECREASE", 100, 50, "컨트롤러 테스트", null, null
        );

        given(aiService.getRecommendation(eq(eventId), eq(mockAdminUserId), any())).willReturn(mockResponse);

        // when & then
        try {
            mockMvc.perform(post("/admin/events/{eventId}/recommendation", eventId)
                            .with(user(mockUserDetails))
                            .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.actionType").value("DECREASE"))
                    .andExpect(jsonPath("$.data.recommendedAdmissionRps").value(100))
                    .andExpect(jsonPath("$.data.rationale").value("컨트롤러 테스트"));
        } finally {
            org.springframework.security.core.context.SecurityContextHolder.clearContext();
        }
    }
}