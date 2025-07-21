$(function() {
  // GNB 열기
  $('.menu_toggle').on('click', function() {
    $('.gnb_side_menu').show();
    $('.gnb_dim').show();
    $('body').css('overflow', 'hidden'); // 스크롤 방지
  });
  // GNB 닫기
  $('.gnb_close_btn, .gnb_dim').on('click', function() {
    $('.gnb_side_menu').hide();
    $('.gnb_dim').hide();
    $('body').css('overflow', '');
  });
  // $(window).on('scroll', function() {
  //   if ($(window).scrollTop() > 200) {
  //     $('.header_wrap').addClass('fixed');
  //   } else {
  //     $('.header_wrap').removeClass('fixed');
  //   }
  // });
});


function gnbOpen(){
  $('.gnb_side_menu').show().addClass('open');
  $('.gnb_dim').show();
  $('body').css('overflow', 'hidden'); // 스크롤 방지
}
function gnbClose(){
  $('.gnb_side_menu').hide().removeClass('open');
  $('.gnb_dim').hide();
  $('body').css('overflow', '');
}