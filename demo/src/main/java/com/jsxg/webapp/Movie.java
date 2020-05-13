package com.jsxg.webapp;

public class Movie {

  private String title;
  private int id;

  Movie(String title, int id) {
    this.title = title;
    this.id = id;
  }

  public void setTitle(String title){
    this.title=title;
  }

  public void setId(int id){
    this.id=id;
  }

  public String getTitle(){
      return this.title;
  }

  public int getId(){
      return this.id;
  }



}