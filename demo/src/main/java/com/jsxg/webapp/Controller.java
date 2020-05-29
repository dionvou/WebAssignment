package com.jsxg.webapp;

import java.sql.SQLException;
import java.util.ArrayList;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Controller {
    Model model = new Model();

    @RequestMapping(value = "html", method = RequestMethod.GET)
    public String startHtml() {
        return "src/main/resources/static/index.html";
    }

    @PostMapping("/users")
    public void createUser(@RequestBody String payload)
            throws JsonMappingException, JsonProcessingException, SQLException {
        User user = new ObjectMapper().readValue(payload, User.class);
        model.registerUser(user);
        System.out.println(user.getUsername());

    }

    @PostMapping("/users/{username}")
    public Boolean loginUser(@RequestBody String payload,@PathVariable String username) throws SQLException, JsonMappingException,
            JsonProcessingException {
        User user = new ObjectMapper().readValue(payload, User.class);
        Boolean b = model.searchByUsername(user);
        return b;
    }


    @GetMapping("/{username}/movies")
    public ArrayList<String> getMovies(@PathVariable String username) throws SQLException {
        ArrayList<String> movies=model.getMovies(username);
        return movies;
    }

    @DeleteMapping("/{username}/movies/{title}")
    public Boolean deleteMovie(@PathVariable String username, @PathVariable String title)throws SQLException{
        System.out.println(username+title);
        boolean deleted = model.removeMovieOfUser(username,title);
        return deleted;
    }


    @PostMapping("/{username}/movies/{title}")
    public Boolean addMovie(@PathVariable String username, @PathVariable String title) throws SQLException{
        System.out.println(username+title);
        boolean added = model.addMovieOfUser(username,title);
        return added;
    }
    
    @GetMapping("/{username}/movies/{title}")
    public Boolean movieIsBookmarked(@PathVariable String username, @PathVariable String title) throws SQLException{
        System.out.println(username+title);
        boolean bookmarked = model.checkMovieOfUser(username,title);
        return bookmarked;
    }
}