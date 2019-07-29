"use strict";
var question_id = 0,
  selected = {
    items: []
  },
  tree_node_list = {},
  unique_id = "",
  old_widget_id = "",
  is_skip = GetQueryString("skip"),
  url = window.location.href.split("?")[0] + "?action_type=ajax";

function removeByValue(e, t) {
  for (var i = 0; i < e.length; i++)
    if (e[i] == t) {
      e.splice(i, 1);
      break
    }
}

function loading(e) {
  $(".testWrap").waitMe({
    effect: "ios",
    text: e
  })
}

function hide_loading(e) {
  $(".testWrap").waitMe("hide")
}

function alertModal(e) {
  var t = "alert_error_",
    i = "#modal_" + t,
    a = '<div class="modal fade alert-modal" tabindex="-1" role="dialog" id="modal_' + t + '" style="display: none;">            <div class="modal-dialog modal-sm">              <div class="modal-content">                <div class="modal-body">' + e + '</div>                <div class="modal-footer">                  <button type="button" class="btn btn-orange" data-dismiss="modal" aria-label="Close">确定</button>                </div>              </div>            </div>          </div>';
  $(i).length || $("body").append(a),
    $(i).modal("show")
}

function setMonth() {
  $(this).next(".month_input").trigger("change")
}

function setYear() {
  var e = "",
    t = 0,
    i = $(this).prev(".year_input").val();
  switch ($(this).val()) {
    case "1":
    case "3":
    case "5":
    case "7":
    case "8":
    case "10":
    case "12":
      t = 31;
      break;
    case "4":
    case "6":
    case "9":
    case "11":
      t = 30;
      break;
    case "2":
      t = i % 4 == 0 && i % 100 != 0 || i % 400 == 0 ? 29 : 28
  }
  for (var a = 1; a <= t; a++)
    e = e + "<option value='" + a + "'>" + a + "</option>";
  $(this).next(".day_input").html(e)
}

function VerifyCard(e) {
  this.vcity = {
      11: "北京",
      12: "天津",
      13: "河北",
      14: "山西",
      15: "内蒙古",
      21: "辽宁",
      22: "吉林",
      23: "黑龙江",
      31: "上海",
      32: "江苏",
      33: "浙江",
      34: "安徽",
      35: "福建",
      36: "江西",
      37: "山东",
      41: "河南",
      42: "湖北",
      43: "湖南",
      44: "广东",
      45: "广西",
      46: "海南",
      50: "重庆",
      51: "四川",
      52: "贵州",
      53: "云南",
      54: "西藏",
      61: "陕西",
      62: "甘肃",
      63: "青海",
      64: "宁夏",
      65: "新疆",
      71: "台湾",
      81: "香港",
      82: "澳门",
      91: "国外"
    },
    this._init_(e)
}

function setCitem() {
  var e = $(this).data("is_unique"),
    t = parseInt($("#id_question").data("iw")),
    i = $(this).attr("id").replace("id_item_", ""),
    a = parseInt($(this).data("it")),
    n = $(this).data("rj");
  if ($(this).hasClass("on")) {
    if (removeByValue(selected.items, i),
      $(this).removeClass("on"),
      5 != t)
      return
  } else
    e ? (selected.items = [],
      unique_id = i,
      $(".c_item").removeClass("on"),
      $(this).addClass("on")) : unique_id && (removeByValue(selected.items, unique_id),
      $("#id_item_" + unique_id).removeClass("on"));
  return a && 0 != a && (100 <= a || (1 == t || 2 == t) && 0 < a) ? ($("#id_item_slider_" + i).modal(),
      $("#id_input_val_" + i).on("keyup change", function () {
        $("#id_input_val_" + i).val() ? $("#id_item_save" + i).attr("class", "item_input_save btn btn-orange") : $("#id_item_save" + i).attr("class", "btn btn-gray")
      })) : 2 != t ? ($(this).addClass("on"),
      handleNextQuestion(t, i)) : (2 == t && n && (n = n.split(",")).forEach(function (e) {
        removeByValue(selected.items, e),
          $("#id_item_" + e).removeClass("on")
      }),
      selected.items.push(i),
      $(this).addClass("on"),
      e && handleNextQuestion(t, i)),
    !1
}

function setContact() {
  var e = $("#id_question").data("iw");
  if (e)
    handleNextQuestion(e);
  else {
    var t = $("#id_name").val().replace(" ", ""),
      i = $("#id_tell").val().replace(" ", "");
    if (!t)
      return alertModal("请填写联系人,方便律师和你沟通."),
        $("#id_name").parent().addClass("errTip"),
        void $(".weui_dialog_ft .weui_btn_dialog").on("click", function () {
          $("#id_name").focus()
        });
    if (!i || i.length < 11)
      return alertModal("请填写联系手机号码,方便律师和你沟通."),
        $("#id_tell").parent().addClass("errTip"),
        void $(".weui_dialog_ft .weui_btn_dialog").on("click", function () {
          $("#id_tell").focus()
        });
    loading("数据加载中..."),
      $.post(url, {
        action: "more_info",
        username: t,
        tell: i
      }, function (e) {
        hide_loading(),
          0 == e.state ? alertModal(e.errors) : (selected = {
              items: []
            },
            tree_node_list = {},
            window.location = e.url)
      })
  }
}

function setItemInput() {
  var e = $(this).attr("id").replace("id_item_save", ""),
    t = $("#id_item_" + e),
    i = t.data("is_unique"),
    a = parseInt($("#id_question").data("iw")),
    n = (t.attr("id"),
      parseInt(t.data("it")),
      t.data("rj"));
  if ($("#id_tmp_" + e).val()) {
    var s = $("#id_tmp_" + e).val();
    $("#id_input_val_" + e).val(s)
  } else
    s = get_input_val(e);
  if (t.addClass("on"),
    -1 == selected.items.indexOf(e))
    2 == a && n && (n = n.split(",")).forEach(function (e) {
      removeByValue(selected.items, e),
        $("#id_item_" + e).removeClass("on")
    }),
    selected.items.push(e);
  else if (5 != a)
    return void removeByValue(selected.items, e);
  if (s)
    if (1 == a || 4 == a || 3 == a || i)
      handleNextQuestion(a, e, s, "modal");
    else {
      var o = $(".widget_items .item .current");
      if (o && o.length) {
        var r = o[o.length - 1];
        s = $(r).text()
      }
      saveState(e, s, a)
    }
  return !1
}

function setWidgetSelect() {
  var t = $(this).data("id"),
    i = $(this).text(),
    a = $(this),
    n = $(this).data("is_parent"),
    s = $(this).parents(".widget_items"),
    o = s.find("input").attr("id").replace("id_input_val_", ""),
    e = "/g/ct/list/" + parseInt($("#id_item_" + o).data("it")) + "/";
  console.log("e:", e);
  console.log("o:", o);
  console.log("t:", t);
  console.log("n:", n);
  $("#id_tmp_" + o).val(t);
  var r = $("#id_question").data("iw");
  n ? (loading("数据加载中..."),
    axios.post(`${baseURL}/api/location`, {
      url: e,
      data: {
        parent_id: t
      }
    }).then(function (e) {
      console.log(e.data.c);
      hide_loading(),
        "chidlren_count" != n ? (a.siblings("a").removeClass("current"),
          a.addClass("current"),
          s.find(".item:first").nextAll().remove()) : (a.siblings("a").removeClass("current"),
          a.addClass("current"),
          a.parent(".item").nextAll().remove()),
        $.isEmptyObject(e.data) && $("#id_input_val_" + o).val(t),
        !$.isEmptyObject(e.data) || 1 != r && 4 != r && 3 != r ? widgetUpdates(e.data, s, r, o, t, i) : ($("#id_item_" + o).addClass("on"),
          handleNextQuestion(r, o, t))
    })) : ($(".w_item").removeClass("on"),
    $(this).parents(".w_item").addClass("on"),
    $("#id_item_" + o).addClass("on"),
    $("#id_input_val_" + o).val(t),
    1 == r || 4 == r || 3 == r ? ($("#id_item_slider_" + o).modal("hide"),
      handleNextQuestion(r, o, t)) : (selected.items.push(o),
      saveState(o, t, r, i)))
}

function prev_page(e) {
  loading("数据加载中..."),
    $.get(url, {
      action: e
    }, function (e) {
      hide_loading(),
        0 == e.state ? alertModal(e.errors) : (selected = {
            items: []
          },
          tree_node_list = {},
          $(".container .modal").remove(),
          e.c && $(".test_wrap").append(e.c),
          $(".testWrap.on").velocity("stop").velocity({
            left: [780, 0],
            opacity: [0, 1]
          }, {
            duration: 500,
            easing: "easeOutCubic",
            display: "none",
            begin: function () {
              $(".testWrap").eq(0).append('<div class="mouseMask"></div>')
            },
            complete: function () {
              $(".testWrap").eq(0).remove()
            }
          }),
          $(".testWrap:not(.on)").css({
            display: "none"
          }).velocity("stop").velocity({
            left: [0, -780],
            opacity: [1, 0]
          }, {
            duration: 500,
            easing: "easeOutQuart",
            display: "block",
            begin: function () {
              $(".testWrap").eq(0).addClass("on"),
                $(this).addClass("on")
            },
            complete: function () {}
          }))
    })
}

function get_input_val(e) {
  var t = parseInt($("#id_item_" + e).data("it")),
    i = "";
  if (3 == t) {
    var a = [];
    $(".item_form_" + e + " select.date_input").each(function () {
        a.push(this.value)
      }),
      i = a.join("-")
  } else if (17 == t) {
    i = $(".item_form_" + e + " select.time_start_hour_input").val() + ":" + $(".item_form_" + e + " select.time_start_minute_input").val() + "-" + ($(".item_form_" + e + " select.time_end_hour_input").val() + ":" + $(".item_form_" + e + " select.time_end_minute_input").val())
  } else
    i = $("#id_input_val_" + e).val();
  return i
}

function handleNextQuestion(e, a, t, i) {
  console.log("e:", e);
  var n = {},
    s = "",
    o = (parseInt($("#id_item_" + a).data("it")),
      parseInt($("#id_item_" + a).data("is_unique")),
      "");
  if ("start" == e)
    n = {};
  else if (1 == e || 4 == e)
    n = {
      item: a,
      action: "next",
      other: {}
    },
    null != t && (n['other']["input_val_" + a] = t);
  else if (5 == e) {
    s = [],
      n = {
        action: "next",
        other: {}
      },
      1 == $("#id_item_" + a).data("is_unique") ? (null != t && (n['other']["input_val_" + a] = t),
        $(".i_item").each(function () {
          code2 = $(this).attr("id").replace("id_item_", ""),
            n['other']["input_val_" + code2] = get_input_val(code2)
        }),
        s.push(a)) : $(".i_item").each(function () {
        if (o)
          return !1;
        a = $(this).attr("id").replace("id_item_", ""),
          n['other']["input_val_" + a] = get_input_val(a),
          s.push(a);
        var e = $("#id_input_val_" + a);
        !$("#id_input_val_" + a).attr("required") || e && "" != e.val() && null != e.val() || (o = {
          code: a,
          errors: $("#id_item_title_" + a).html() + " 是必填"
        })
      }),
      n.item = s
    console.log('n:', n);
  } else if (3 == e)
    a = $("#id_question").data("qid"),
    n = {
      item: a,
      action: "next",
      other: {}
    },
    s = get_input_val(a),
    $("#id_input_val_" + a).attr("required") && !s && (o = {
      code: a,
      errors: $("#id_question").html() + " 是必填"
    }),
    n['other']["input_val_" + a] = s,
    console.log("n:", n);
  else if (2 == e)
    n = {
      item: selected.items,
      action: "next",
      other: {}
    },
    selected.items.length <= 0 ? o = {
      errors: "此项为关键信息，需要您填写才可进行下一步咨询"
    } : $.each(selected.items, function (e, t) {
      var i = $("#id_input_val_" + t);
      i && null != (i = i.val()) && (n['other']["input_val_" + t] = i)
    });
  else {
    s = [],
      $("input.c_item:checked").each(function () {
        s.push(this.value)
      }),
      n = {
        item: s,
        action: "next",
      };
    var r = $("#id_input_val_" + s);
    r && null != (r = r.val()) && (n["input_val_" + s] = r)
  }

  return o ? (alertModal(o.errors),
      $("#id_input_val_" + a).addClass("errTip"),
      $("#id_input_val_" + a).focus()) : (loading("数据加载中..."),
      axios.post(`${baseURL}/api/send`, {
        data: n,
        url: JasonURL,
        'cookie': {
          'sessionid': JasonCookie
        }
      }).then(function (response) {
        e = response.data.data
        console.log("e:", e);
        hide_loading();
        var t = $("#id_question").data("iw");
        if (0 == e.state) {
          if ("string" == typeof e.errors)
            alertModal(e.errors),
            3 == t && $("#id_item_state" + a).parent().addClass("errTip");
          else {
            a = e.errors[0];
            var i = $("#id_item_title_" + a).html();
            e.errors[1] ? alertModal(e.errors[1]) : alertModal(i + " 是必填"),
              $("#id_item_state" + a).parent().addClass("errTip")
          }
          $("body").on("hidden.bs.alert-modal", function (e) {
            $("#id_input_val_" + a).focus()
          })
        } else {
          if (e.url) return window.location.href = `https://ai.12348.gov.cn${e.url}`
          e.cd && 0 == e.iw && e.url ? window.location = e.url : (selected = {
              items: []
            },
            tree_node_list = {},
            $("#id_item_slider_" + a).modal("hide"),
            $("body").removeClass("modal-open"),
            $(".modal-backdrop").remove(),
            renderPage(e))
        }
      })),
    !1
}

function skipContact(e) {
  loading("数据加载中..."),
    $.post(url, {
      action: "more_info",
      username: "PC用户",
      tell: "13000000000"
    }, function (e) {
      hide_loading(),
        0 == e.state ? alertModal(e.errors) : (selected = {
            items: []
          },
          tree_node_list = {},
          window.location = e.url)
    })
}

function renderPage(e) {
  const data = e.c ? e.c : e
  // console.log(data);
  if (!e.iw && localStorage.skip_contact)
    return skipContact(),
      !1;
  $(".container .modal").remove(),
    data && $(".test_wrap").append(data),
    $(".testWrap.on").velocity("stop").velocity({
      left: [-780, 0],
      opacity: [0, 1]
    }, {
      duration: 500,
      easing: "easeOutCubic",
      display: "none",
      begin: function () {
        $(".testWrap").eq(0).append('<div class="mouseMask"></div>')
      },
      complete: function () {
        $(".testWrap").eq(0).remove()
      }
    }),
    $(".testWrap:not(.on)").css({
      display: "none"
    }).velocity("stop").velocity({
      left: [0, 780],
      opacity: [1, 0]
    }, {
      duration: 500,
      easing: "easeOutQuart",
      display: "block",
      begin: function () {
        $(".testWrap").eq(0).addClass("on"),
          $(this).addClass("on")
      },
      complete: function () {}
    })
}

function widgetUpdates(e, t, i, a, n, s) {
  var o = "";
  $.each(e, function (e, t) {
      o += '<a href="javascript:;" data-id="' + e + '" data-is_parent="chidlren_count">' + t + "</a>"
    }),
    o ? t.append('<div class="item">' + o + "</div>") : ($("#id_item_" + a).addClass("on"),
      selected.items.push(a),
      saveState(a, n, i, s))
}

function saveState(e, t, i, a) {
  a ? $("#id_item_state" + e).addClass("on").text(a) : t ? $("#id_item_state" + e).addClass("on").text(t) : $("#id_item_state" + e).removeClass("on").text("请输入"),
    $("#id_item_slider_" + e).modal("hide")
}

function getVerifyCard(e) {
  var t = new VerifyCard,
    i = e,
    a = i.val();
  i.parent().find(".input-tip").remove(),
    t._init_(a) || i.parent().append('<div class="input-tip" style="color:#ff6700; padding-top:5px">*提示：身份证填写不正确</div>')
}

function update_nav() {
  var a = [],
    i = [];
  $("#sider_nav .nav").html(""),
    $("#id_content h1").each(function (e) {
      var t = $("#id_content h1").eq(e).text(),
        i = {
          title: t = t.substring(t.indexOf("、") + 1, t.length),
          id: "#report_ht_" + e
        };
      $("#id_content h1").eq(e).attr("id", "report_ht_" + e),
        a.push(i)
    }),
    $.each(a, function (e, t) {
      i.push('<li><a class="clearfix" data-dom="' + t.id + '" href="' + t.id + '"><p>' + t.title + "</p></a></li>")
    }),
    $("#sider_nav .nav").prepend(i),
    $("#sider_nav .nav li").each(function (e) {
      var t = (e += 1) < 10 ? "0" : "";
      $(this).find("a").prepend("<i>" + (t + e) + "</i>"),
        $(this).find("a").on("click", function (e) {
          e.preventDefault();
          var t = this,
            i = $(this).data("dom"),
            a = $(i).offset().top;
          $(this).parent().hasClass("active") || $("#sider_nav .nav").addClass("on"),
            $("html,body").stop().animate({
              scrollTop: a
            }, "fast", function () {
              $("#sider_nav .nav .active").removeClass("active"),
                $(t).parent().addClass("active"),
                $("#sider_nav .nav").removeClass("on")
            })
        })
    }),
    $('[data-spy="scroll"]').each(function () {
      $(this).scrollspy("refresh")
    })
}

function advisory() {
  $("#advisory").modal()
}

function getCookie(e) {
  for (var t = e + "=", i = document.cookie.split(";"), a = 0; a < i.length; a++) {
    var n = i[a].trim();
    if (0 === n.indexOf(t))
      return n.substring(t.length, n.length)
  }
  return ""
}

function load_cases(e) {
  $.get(e, function (e) {
    var i = "";
    $.each(e, function (e, t) {
        i += '<li><a href="/case/' + t.id + '/" target="_blank">' + t.title + "</a></li>"
      }),
      i ? $("#id_case_list").html(i) : ($("#r_cases").remove(),
        $("#id_nav_cases").remove()),
      update_nav()
  })
}

function load_videos(e) {
  $.get(e, function (e) {
    var i = "";
    $.each(e, function (e, t) {
        i += '<li><a href="' + t.url + '">' + t.title + "</a></li>"
      }),
      i ? $("#id_video_list").html(i) : ($("#r_videos").remove(),
        $("#id_nav_videos").remove()),
      update_nav()
  })
}

function load_faqs(e) {
  $.get(e, function (e) {
    var i = "";
    $.each(e, function (e, t) {
        i += '<li><a href="http://www.lvpin100.com/faq/' + t.id + '/" target="_blank">' + t.title + "</a></li>"
      }),
      i ? $("#id_faq_list").html(i) : ($("#r_faqs").remove(),
        $("#id_nav_faqs").remove()),
      update_nav()
  })
}

function load_laws(e) {
  $.get(e, function (e) {
    var i = "";
    $.each(e, function (e, t) {
        i += '<li><div class="bt">' + (e + 1) + ". " + t.title + '</div><div class="bd"><p>' + t.content + "</p></div></li>"
      }),
      i ? $("#id_law_list").html(i) : ($("#r_laws").remove(),
        $("#id_nav_laws").remove(),
        $("#id_contact1").remove()),
      update_nav()
  })
}

function post_rate(e) {
  var t = GetQueryString("id");
  document.cookie = "is_help=1; expires=Fri, 31 Dec 9999 23:59:59 GMT",
    document.cookie = "id=" + t + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
  var i = {
      rate: e,
      rate_content: $("#id_suggest").val()
    },
    a = window.location.href;
  $.post(a.replace("/g/r/", "/g/r/rate/"), i, function (e) {})
}

function GetQueryString(e) {
  var t = new RegExp("(^|&)" + e + "=([^&]*)(&|$)"),
    i = window.location.search.substr(1).match(t);
  return null != i ? unescape(i[2]) : null
}

function setHelp() {
  var e = "";
  $(".is_help_option .c1").on("click", function () {
      e = 1,
        $(".is_help_option").hide(),
        $(".is_help_suggest").show()
    }),
    $(".is_help_option .c2").on("click", function () {
      e = -1,
        $(".is_help_option").hide(),
        $(".is_help_suggest").show()
    }),
    $(".is_help_suggest a").on("click", function () {
      $(".is_help_suggest").hide(),
        $(".is_help_finish").fadeIn(),
        post_rate(e)
    })
}
VerifyCard.prototype = {
    constructor: VerifyCard,
    _init_: function (e) {
      return !(e && this.isCardNo(e) && this.checkProvince(e) && this.checkBirthday(e) && this.checkParity(e))
    },
    isCardNo: function (e) {
      return !1 !== /(^\d{15}$)|(^\d{17}(\d|X)$)/.test(e)
    },
    checkProvince: function (e) {
      var t = e.substr(0, 2);
      return null != this.vcity[t]
    },
    checkBirthday: function (e) {
      var t = e.length;
      if ("15" == t) {
        var i = (o = e.match(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/))[2],
          a = o[3],
          n = o[4],
          s = new Date("19" + i + "/" + a + "/" + n);
        return this.verifyBirthday("19" + i, a, n, s)
      }
      if ("18" == t) {
        var o;
        i = (o = e.match(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/))[2],
          a = o[3],
          n = o[4],
          s = new Date(i + "/" + a + "/" + n);
        return this.verifyBirthday(i, a, n, s)
      }
      return !1
    },
    verifyBirthday: function (e, t, i, a) {
      var n = (new Date).getFullYear();
      if (a.getFullYear() == e && a.getMonth() + 1 == t && a.getDate() == i) {
        var s = n - e;
        return 3 <= s && s <= 100
      }
      return !1
    },
    checkParity: function (e) {
      if ("18" == (e = this.changeFivteenToEighteen(e)).length) {
        var t, i = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2),
          a = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"),
          n = 0;
        for (t = 0; t < 17; t++)
          n += e.substr(t, 1) * i[t];
        return a[n % 11] == e.substr(17, 1)
      }
      return !1
    },
    changeFivteenToEighteen: function (e) {
      if ("15" == e.length) {
        var t, i = new array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2),
          a = new array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"),
          n = 0;
        for (e = e.substr(0, 6) + "19" + e.substr(6, e.length - 6),
          t = 0; t < 17; t++)
          n += e.substr(t, 1) * i[t];
        return e += a[n % 11]
      }
      return e
    }
  },
  $(function () {
    is_skip && (localStorage.skip_contact = !0),
      $("body").on("hidden.bs.modal", function (e) {
        $(".alert-modal").remove()
      }),
      $("body").on("change", ".year_input", setMonth).on("change", ".month_input", setYear),
      $("body").on("blur", ".com_id_no", function () {
        getVerifyCard($(this))
      }).on("keyup", ".com_id_no", function () {
        18 == $(this).val().length && getVerifyCard($(this))
      }),
      $("body").on("click", ".c_item", setCitem),
      $("body").on("click", "#id_post_btn", setContact),
      $("body").on("click", ".item_input_save", setItemInput),
      $("body").on("click", "#id_prev_page", function () {
        return prev_page("prev"),
          !1
      }).on("click", "#id_restart", function () {
        return prev_page("restart"),
          !1
      }),
      $("body").on("click", ".widget_items .option-ht, .widget_items .item a", setWidgetSelect)
  }),
  $(function () {
    if ($('[data-toggle="tooltip"]').tooltip(),
      0 < $("#r_report").length) {
      var t = window.location.href;
      $.get(t.replace("/g/r/", "/g/r/c/"), function (e) {
        $("#id_content").html(e),
          load_cases(t.replace("/g/r/", "/g/r/cases/")),
          load_videos(t.replace("/g/r/", "/g/r/videos/")),
          load_faqs(t.replace("/g/r/", "/g/r/faqs/")),
          load_laws(t.replace("/g/r/", "/g/r/laws/")),
          update_nav()
      })
    }
    $(".js--print").on("click", function () {
      $("body,html").scrollTop(0),
        window.print()
    });
    var e = getCookie("id"),
      i = getCookie("is_help");
    GetQueryString("id") != e ? setHelp() : "" === i ? setHelp() : $(".is_help").hide()
  });