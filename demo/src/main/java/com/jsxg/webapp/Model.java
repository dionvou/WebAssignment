package com.jsxg.webapp;

import java.sql.*;
import java.util.ArrayList;

public class Model {
    Connection con;

    private void ConnectToDb(){
        try{  
            Class.forName("com.mysql.jdbc.Driver");  
            con=DriverManager.getConnection("jdbc:mysql://localhost:3306/movies","user","ThePassword");  
            //here movies is database name, root is username and password  
            // Statement stmt=con.createStatement();  
            // ResultSet rs=stmt.executeQuery("select * from user");  
            // while(rs.next())  
            // System.out.println(rs.getString(1)+"  "+rs.getString(2)+"  "+rs.getString(3));  
            // con.close();  
        }catch(Exception e){ 
            System.out.println(e);
        }  
    }  

    private void DisconnectFromDb(){
        try{
            con.close();
        }catch(Exception e){ 
            System.out.println(e);
        }
    }

    public void registerUser(User user) throws SQLException {
        ConnectToDb();
        Statement stmt=con.createStatement();  
        stmt.executeUpdate("INSERT INTO user VALUES ('"+user.getUsername()+"','"+user.getEmail()+"','"+user.getPassword()+"');");

        DisconnectFromDb();
    }

    public Boolean searchByUsername(User user) throws SQLException {
        ConnectToDb();

        Statement stmt=con.createStatement();  
        ResultSet rs = stmt.executeQuery("SELECT username FROM user WHERE user.username='"+user.getUsername()+"' AND user.password='"+user.getPassword()+"';");
        
        if(rs.next()){
            DisconnectFromDb();
            return true;
        }
        DisconnectFromDb();
        return false;

    }


    public ArrayList<String> getMovies(String username) throws SQLException {
        ConnectToDb();
        Statement stmt=con.createStatement();  
        ResultSet rs = stmt.executeQuery("SELECT title FROM user_movies WHERE user_movies.username='"+username+"';");
        ArrayList<String> movies = new ArrayList<String>();
        while(rs.next()) {
            movies.add(rs.getString(1));
        } 
        DisconnectFromDb();
        return movies;

    }

    public Boolean removeMovieOfUser(String username, String title) throws SQLException {
        ConnectToDb();
        Statement stmt=con.createStatement();  
        int rs=stmt.executeUpdate("DELETE user_movies FROM user_movies WHERE user_movies.username='" + username+ "' AND user_movies.title='"+title+"';");
        DisconnectFromDb();
        //rs==1 if delete was execute, 0 if delete wasnt executed;
        return rs==1;

    }
    
    public Boolean addMovieOfUser(String username, String title) throws SQLException {
        ConnectToDb();
        Statement stmt=con.createStatement();  
        int rs=stmt.executeUpdate("INSERT INTO user_movies VALUES ('"+username+"','"+title+"');");
        DisconnectFromDb();
        //rs==1 if add was execute, 0 if add wasnt executed;
        return rs==1;

    }

    public Boolean checkMovieOfUser(String username, String title) throws SQLException {
        ConnectToDb();
        Statement stmt=con.createStatement();  
        ResultSet rs = stmt.executeQuery("SELECT * FROM user_movies WHERE user_movies.title='" + title + "' AND user_movies.username='" + username + "';");
       
        //rs==1 if user has bookmarked the movie
        if(rs.next()){
             DisconnectFromDb();
            return true;
        }
        DisconnectFromDb();
        return false;
    }


    
}