/*
 * Galleria V2 - JQuery Masonry Widget for Blogger JSON by Taufik Nurrohman
 * URL's: https://plus.google.com/108949996304093815163/about
 *		http://hompimpaalaihumgambreng.blogspot.com/2012/07/rilis-galleria-v2-widget-masonry-untuk.html
 * Licence: http://creativecommons.org/licenses/by-nc-sa/3.0/
 */

function postBrick(json) {

	var entry = json.feed.entry, // Get the post contents...
		skeleton = "";

	// Box animations ? Use JavasScript or CSS Transition?
	// More => http://masonry.desandro.com/docs/animating.html#css_transitions
	if (jm_animateWithTransition && jm_isAnimated !== true) {
		$jm_container.addClass('css-transition');
	}

	for (var i = 0; i < numposts; i++) {
		if (i == entry.length) break;
		var postTitle = entry[i].title.$t, // Get the post titles...
			postAuthor = entry[i].author[0].name.$t, // Get the post author
			postDate = entry[i].published.$t.substring(0,10), // Post date... e.g: "2012-02-07T12:56:00.000+07:00".substring(0,10) => 2012-02-07
			postContent = ("summary" in entry[i]) ? entry[i].summary.$t : '', // Get the post content
			postImage = ("media$thumbnail" in entry[i]) ? entry[i].media$thumbnail.url : jm_fallbackThumb, // Get the pos thumbnail
			postUrl, commentNum, commentLabel;

		var dy = postDate.substring(0,4), // Take 4 characters from the "postDate" beginning, it means the year (2012)
			dm = postDate.substring(5,7), // Take 2 character 5 step from "postDate" beginning, it mean the month (02)
			dd = postDate.substring(8,10); // Take 2 character 8 step from "postDate" beginning. it means the day (07)

		// Get the post URL
		for (var j = 0, elen = entry[i].link.length; j < elen; j++) {
			postUrl = (entry[i].link[j].rel == 'alternate') ? entry[i].link[j].href : '#nope';
		}

		for (var k = 0, clen = entry[i].link.length; k < clen; k++) {
			// Grab the "10 Comments" --for the example--
			if (entry[i].link[k].rel == 'replies' && entry[i].link[k].type == 'text/html') {
				commentNum = entry[i].link[k].title.split(" ")[0]; // Get the comment count => "10"
				if (jm_commentLabel === "") {
					commentLabel = entry[i].link[k].title.split(" ")[1]; // Get the comment label => "Comments"
				} else {
					commentLabel = jm_commentLabel; // User defined
				}
				break;
			} else {
				commentNum = "";
				commentLabel = "&nbsp;";
			}
		}

		// About Picasa compression method, using image path such as "s1600/image.jpg", "s400/image.jpg", "s72-c/image.jpg", ...
		// Now you try to reduce the image resolution by replacing the "s[0-9]+" path with your own resolutions
		// Get the image URL from JSON (a mini thumbnail version => "s72-c/image.jpg")
		postImage = (!squareImage) ? postImage.replace(/\/s[0-9]+\-c\//, "\/s"+jm_columnWidth+"\/") : postImage.replace(/\/s[0-9]+\-c\//, "\/s"+jm_columnWidth+"-c\/");

		// Strip all HTML tags
		postContent = postContent.replace(/<br ?\/?>/g, " ").replace(/<\S[^>]*>/g, "");
		postContent = (postContent.length > numchars) ? postContent.substring(0, numchars) + '&hellip;' : postContent; // Reduce post summary length

		// Open link in new window?
		var tg = (newTabLink) ? ' target=\"_blank\"' : '';

		// Now grab the skeleton! In the Java language means "balung"
		if (viewMode == "summary") {
			skeleton += '<div style="width:' + jm_columnWidth + 'px;" class="json_post json_summary-mode">';
			skeleton += '<h3 class="json_post-title"><a href="' + postUrl + '"' + tg + '>' + postTitle + '</a></h3>';
			skeleton += '<span class="json_sub-header">';
			skeleton += '<span class="json_author">' + jm_subHeaderText[0] + ' ' + postAuthor + '</span> ';
			skeleton += '<br>' + jm_subHeaderText[1] + ' <abbr class="json_post-date">' + dd + ' ' + jm_monthNames[(Number(dm)-1)] + ' ' + dy + '</abbr>';
			skeleton += '</span>';
			skeleton += '<div class="json_post-body">';
			skeleton += (showThumbnails) ? '<a class="json_img-container loading" href="' + postUrl + '"' + tg + '><img src="' + postImage + '" alt="' + postTitle + '"/></a>' : skeleton;
			skeleton += (numchars > 0) ? '<p>' + postContent + '</p>' : skeleton;
			skeleton += '</div>';
			skeleton += '<span class="json_post-footer clearfix">';
			skeleton += '<span class="json_comment">' + commentNum + ' ' + commentLabel + '</span>';
			skeleton += '<a class="json_more" href="' + postUrl + '"' + tg + '>+</span>';
			skeleton += '</span>';
			skeleton += '</div>';
		} else if (viewMode == "thumbnail") {
			skeleton += '<figure class="json_post json_thumbnail-mode loading">';
			skeleton += '<a href="' + postUrl + '"' + tg + '><img src="' + postImage + '" alt="' + postTitle + '" style="width:' + jm_columnWidth + 'px;"/></a>';
			skeleton += '<figcaption>';
			skeleton += '<strong class="json_caption"><a href="' + postUrl + '"' + tg + '>' + postTitle + '</a></strong>';
			skeleton += '<span class="json_post-date">' + dd + ' ' + jm_monthNames[(Number(dm)-1)] + ' ' + dy + '</span> ';
			skeleton += '<span class="json_comment">' + commentNum + ' ' + commentLabel + '</span>';
			skeleton += '</figcaption>';
			skeleton += '</figure>';
		} else {
			skeleton += '<div class="json_alert">Hmmm.... Nothing.</div>';
		}
	}

	// Append the generated content...
	$jm_container.append(skeleton);

	// I'm writing "Page # of #"
	var tp = $jm_totalPosts.html().split('#'),
		postTotal = parseInt(json.feed.openSearch$totalResults.$t,10); // Get total items...
	if(window.location.search) {
		$jm_totalPosts.html(
			tp[0] + window.location.search.substr(6) + tp[1] + Math.round((postTotal/numposts)+1)
		);
	} else {
		$jm_totalPosts.html(
			tp[0] + "1" + tp[1] + Math.round((postTotal/numposts)+1)
		);
	}

	// Show the navigation
	$jm_nav.show();
	// Set the navigation location.search as "?page=1", "?page=2", "?page=3", blablablah...
	$jm_prev.attr('href', "?page=" + (parseInt(window.location.search.substr(6),10)-1));
	$jm_next.attr('href', "?page=" + (parseInt(window.location.search.substr(6),10)+1));
	if (!window.location.search || window.location.search == "?page=1") {
		$jm_prev.removeAttr('href').html('&#215;');
		$jm_next.attr('href', '?page=2');
	}
	if (parseInt(window.location.search.substr(6),10) >= Math.round((postTotal/numposts)+1)) {
		$jm_next.removeAttr('href').html('&#215;');
	}

	// Run the masonry plugin!
	$jm_container.masonry({
		itemSelector:$jm_itemSelector,
		isAnimated:jm_isAnimated,
		animationOptions:jm_animationOptions,
		isFitWidth:jm_isFitWidth,
		gutterWidth:jm_gutterWidth,
		isRTL:jm_isRTL
	}).find('img').css('opacity',0).each(function() {
		if (viewMode == "summary") {
			$(this).one("load", function() {
				$(this).animate({opacity:1}, jm_fadeSpeed, function() {
					$jm_container.masonry("reload");
				}).parent().removeClass('loading');
			});
		}
		$(this).on("load", function() {
			var i_w = $(this).outerWidth(),
				i_h = $(this).outerHeight();
			$(this).parents('.json_post.json_thumbnail-mode').removeClass('loading').animate({
				width:i_w,
				height:i_h
			}, jm_resizeSpeed, function() {
				$(this).find('img').animate({opacity:1}, jm_fadeSpeed, function() {
					$jm_container.masonry("reload");
				});
			}).hover(function() {
				$(this).find('figcaption').slideDown();
			}, function() {
				$(this).find('figcaption').slideUp();
			});
		});
	});
	// The end. You die!

}

$(window).on("load", function() {
	$('#json_loading').addClass('loaded').text(jm_loadedText).delay(700).fadeOut('fast');
});

var jm_currentPage = (window.location.search && window.location.search !== "?page=1") ? numposts*(parseInt(window.location.search.substr(6), 10)-1) : 1, // Navigation
	specificLabel = (jm_postCategory !== null) ? "-/" + jm_postCategory : ""; // Sort posts by categories...
(function() {
	var s = document.createElement('script');
		s.type = "text/javascript";
		s.src = jm_homePage + "/feeds/posts/summary/" + specificLabel + "?alt=json-in-script&start-index=" + jm_currentPage + "&redirect=false&callback=postBrick";
	document.getElementsByTagName('head')[0].appendChild(s);
})();
