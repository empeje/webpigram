package io.mpj.webpigram.epigram.feeds;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.google.common.collect.ImmutableList;
import io.mpj.webpigram.WebpigramApplication;
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
  @Autowired private MockMvc mockMvc;

  @Test
  @DisplayName("Should return feed content when GET /feeds is called")
  void shouldReturnFeedContent() throws Exception {
    // Given
    when(feedsService.getFeeds())
        .thenReturn(
            ImmutableList.of(
                new Feeds(
                    1,
                    "Hello",
                    "John Doe",
                    10,
                    5,
                    LocalDateTime.parse("2025-03-16T21:41:50.873015"),
                    ImmutableList.of("Java", "Python", "C++"))));

    // When & Then
    var expectedResponse =
        """
        [{"id":1,"content":"Hello","author":"John Doe","upVotes":10,"downVotes":5,"createdAt":"2025-03-16T21:41:50.873015","topics":["Java","Python","C++"]}]
        """;

    mockMvc
        .perform(get("/feeds").accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().json(expectedResponse));
  }

  @Test
  public void testGetEpigramById_Found() throws Exception {
    // Arrange
    long epigramId = 1L;
    Feeds epigram =
        new Feeds(
            epigramId,
            "Test epigram content",
            "Test Author",
            10L,
            2L,
            LocalDateTime.now(),
            ImmutableList.of("test", "programming"));

    when(feedsService.getEpigramById(epigramId)).thenReturn(epigram);

    // Act & Assert
    mockMvc
        .perform(get("/epigram/{id}", epigramId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(epigramId))
        .andExpect(jsonPath("$.content").value("Test epigram content"))
        .andExpect(jsonPath("$.author").value("Test Author"))
        .andExpect(jsonPath("$.upVotes").value(10))
        .andExpect(jsonPath("$.downVotes").value(2))
        .andExpect(jsonPath("$.topics").isArray())
        .andExpect(jsonPath("$.topics[0]").value("test"))
        .andExpect(jsonPath("$.topics[1]").value("programming"));
  }

  @Test
  public void testGetEpigramById_NotFound() throws Exception {
    // Arrange
    long epigramId = 999L;
    when(feedsService.getEpigramById(epigramId)).thenReturn(null);

    // Act & Assert
    mockMvc.perform(get("/epigram/{id}", epigramId)).andExpect(status().isNotFound());
  }
}
