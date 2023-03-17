package com.choongang.scheduleproject.project.service;




import com.choongang.scheduleproject.command.ProjectMemberVO;

import java.util.ArrayList;
import java.util.List;

import com.choongang.scheduleproject.command.ChatVO;

import com.choongang.scheduleproject.command.ProjectVO;
import com.choongang.scheduleproject.command.UserVO;



public interface ProjectService {
	
	/***
	 * 
	 * @param vo
	 * @return int
	 */
	public int regist(ProjectVO vo); //프로젝트 등록
	
	/***
	 * 
	 * @param pvo
	 * @return int
	 */
	public int registMember(ProjectMemberVO pvo); //프로젝트 별 팀원 등록
	
	public List<ProjectVO> getDepList(); //부서 목록
	
	/***
	 * 
	 * @param department_id
	 * @return List
	 */
	public List<ProjectVO> getDepMemberList(int department_id); //부서별 팀원 목록

	//startProjectList
	public ArrayList<UserVO> getProjectMember(int pj_num);
	
	public ProjectVO getProject(int pj_num);

	public UserVO getUserVO(String user_id);
	
	public int setChat(ChatVO vo);
	
	public ArrayList<ChatVO> getChat(int pj_num);
	
	public int deleteChat(int chat_num);
	
	public int modifyChat(int chat_num, String modifyContent);
	
	public ArrayList<ProjectVO> getProjectList(String user_id);
	
	public int changeBookmark(String user_id,int pj_num, boolean pj_bookmark);
	
	public String getUserName(String user_id);
	
	//프로젝트 삭제
	public int deleteProject(int pj_num);
}

