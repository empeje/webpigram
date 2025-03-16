package io.mpj.webpigram.epigram.feeds;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FeedsController {
    @GetMapping("/feeds")
    public String getFeeds() {
        return "Hello";
    }
}
