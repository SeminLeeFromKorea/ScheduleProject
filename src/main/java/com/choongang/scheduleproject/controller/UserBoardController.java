package com.choongang.scheduleproject.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.choongang.scheduleproject.board.service.AdminNoticeService;
import com.choongang.scheduleproject.board.service.UserBoardService;
import com.choongang.scheduleproject.command.AdminNoticeListVO;
import com.choongang.scheduleproject.command.ProjectVO;
import com.choongang.scheduleproject.project.service.ProjectService;
import com.choongang.scheduleproject.util.Criteria;
import com.choongang.scheduleproject.util.PageVO;

@Controller
@RequestMapping("/userboards")
public class UserBoardController {

	@Autowired
	@Qualifier("adminNoticeService")
	private AdminNoticeService adminNoticeService;

	@Autowired
	@Qualifier("userBoardService")
	private UserBoardService userBoardService;

	@Autowired
	@Qualifier("projectService")
	private ProjectService projectService;

	@GetMapping("/teamBoardList")
	public String teamBoardList(Criteria cri, Model model,@RequestParam("pj_num") int pj_num) {
		ProjectVO pjVO = projectService.getProject(pj_num);
		int total = userBoardService.getCount(cri);
		model.addAttribute("pjVO",pjVO);
		return "/userboards/teamBoardList";
	}

	@GetMapping("/teamBoardRegist")
	public String teamBoardRegist() {
		return "/userboards/teamBoardRegist";
	}
	@GetMapping("/teamBoardModify")
	public String teamBoardModify() {
		return "/userboards/teamBoardModify";
	}
	@GetMapping("/teamBoardContent")
	public String teamBoardContent() {
		return "/userboards/teamBoardContent";
	}

	@GetMapping("/notice-list")
	public String noticeTableList(Criteria cri, Model model) {

		int total = adminNoticeService.getCount(cri);
		model.addAttribute("AdminNoticeList", adminNoticeService.getList(cri)); //페이지에 넘길 데이터

		PageVO pageVO = new PageVO(cri, total); //페이징에 사용

		model.addAttribute("pageVO", pageVO);


		return "/userboards/notice-list";
	}

	//위의 noticeTableList를 상세 조회하는 컨트롤러
	@GetMapping("/notice-content")
	public String noticeContent(@RequestParam("notice_num") int notice_num, Model model) {

		//클릭한 글 번호에 대한 내용을 조회
		AdminNoticeListVO adminNoticeListVO = adminNoticeService.getContent(notice_num);
		model.addAttribute("adminNoticeListVO", adminNoticeListVO);


		return "/userboards/notice-content";
	}



}
