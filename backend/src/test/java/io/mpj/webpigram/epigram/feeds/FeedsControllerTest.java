package io.mpj.webpigram.epigram.feeds;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.google.common.collect.ImmutableList;
import io.mpj.webpigram.WebpigramApplication;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(FeedsController.class)
@ContextConfiguration(classes = WebpigramApplication.class)
final class FeedsControllerTest {

  @MockitoBean private FeedsService feedsService;
  @MockitoBean private Clock clock;
  @Autowired private MockMvc mockMvc;

  @Test
  @DisplayName("Should return feed content when GET /feeds is called")
  void shouldReturnFeedContent() throws Exception {
    // Given
    when(clock.instant()).thenReturn(Instant.parse("2025-03-16T21:41:50.873015Z"));
    when(feedsService.getFeeds())
        .thenReturn(
            new Feeds(
                1,
                "Hello",
                "John Doe",
                10,
                5,
                LocalDateTime.parse("2025-03-16T21:41:50.873015"),
                ImmutableList.of("Java", "Python", "C++")));

    // When & Then
    var expectedResponse =
        """
        {"id":1,"content":"Hello","author":"John Doe","upVotes":10,"downVotes":5,"createdAt":"2025-03-16T21:41:50.873015","topics":["Java","Python","C++"]}
        """;

    mockMvc
        .perform(get("/feeds").accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().json(expectedResponse));
  }
}
