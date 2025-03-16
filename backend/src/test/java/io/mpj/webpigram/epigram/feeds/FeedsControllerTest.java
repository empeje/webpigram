package io.mpj.webpigram.epigram.feeds;

import io.mpj.webpigram.WebpigramApplication;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(FeedsController.class)
@ContextConfiguration(classes = WebpigramApplication.class)
final class FeedsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Should return feed content when GET /feeds is called")
    public void shouldReturnFeedContent() throws Exception {
        // Perform a GET request to /feeds and verify the response
        mockMvc.perform(get("/feeds")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("Hello"));
    }
}