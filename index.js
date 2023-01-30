"use strict";

$(()=>{

    function colorContrastRatio(fg, bg){
    
		const hexToRGB = (hc) => {
			
			if(hc.startsWith("#")) hc = hc.split("#")[1];
			
			return [ parseInt(hc.substring(0, 2), 16), parseInt(hc.substring(2, 4), 16), parseInt(hc.substring(4, 6), 16) ];
			
		};
		
		const luminance = (hc) => {
			
			let [ lumR, lumG, lumB ] = hexToRGB(hc).map(c => {
			
				let proposition = c / 255;
				
				return proposition <= 0.03928 ? proposition / 12.92 : Math.pow((proposition + 0.055) / 1.055, 2.4);
				
			});
		
			return 0.2126 * lumR + 0.7152 * lumG + 0.0722 * lumB;
			
		};
		
		let lum_fg = luminance(fg),
			lum_bg = luminance(bg), 
			darkerLum = Math.min(lum_fg, lum_bg),
			lighterLum = Math.max(lum_fg, lum_bg),
			contrast_ratio = (lighterLum + 0.05) / (darkerLum + 0.05),
			contrast_label, contrast_description, contrast_index;

		contrast_ratio = parseFloat(contrast_ratio.toFixed(2));

		if(contrast_ratio >= 12){ 
            contrast_index = 5;
			contrast_label = "Super";
			contrast_description = "Great contrast for all text sizes.";
		}else if(contrast_ratio >= 7){
            contrast_index = 4;
			contrast_label = "Very good";
			contrast_description = "Good contrast for small text (below 18pt) and great contrast for large text (above 18pt or bold above 14pt).";
		}else if(contrast_ratio >= 4.5){
            contrast_index = 3;
			contrast_label = "Good";
			contrast_description = "Good contrast for all text sizes.";
		}else if(contrast_ratio >= 3){
            contrast_index = 2;
			contrast_label = "Poor";
			contrast_description = "Poor contrast for small text (below 18pt) and good contrast for large text (above 18pt or bold above 14pt).";
		}else{
            contrast_index = 1;
			contrast_label = "Very poor";
			contrast_description = "Poor contrast for all text sizes.";
		}
		
		return {
			value: contrast_ratio,
			label: contrast_label,
            index: contrast_index,
			description: contrast_description
		};
		
	}

    function CCRDiplay(){

        let color = {
            text: $("#text-color").val().trim(),
            bg: $("#bg-color").val().trim()
        };

        let { value, label, index, description } = colorContrastRatio(color.text, color.bg);

		$("meta[name='theme-color']").attr("content", color.bg);
        $("#ccr-value").text(value);
        $("#ccr-label").text(label);
        $("#ccr-desc").text(description);
        $("#contrast-rating").attr("ccr", index);  
		$("#contrast-st-rating").attr("ccr", index); 
		$("#contrast-lt-rating").attr("ccr", index);        

    }

    Coloris({
        el: ".coloris",
        margin: 8,
        theme:"default",
        themeMode:"light",
        alpha:false
    });

    $("#text-color").on("input", () => {

        let text_color = $("#text-color").val().trim();
        
        $("#template").css({ "color": text_color });
        CCRDiplay();

    });

    $("#bg-color").on("input", () => {

        let bg_color = $("#bg-color").val().trim();
        
        $("#template").css({ "background-color": bg_color });
        CCRDiplay();

    });

	$(".input-field > button").each((i, btn) => {
		$(btn).on("click", ()=>{ 
			
			let value = $(btn).siblings()[1].children[1].value.trim().toUpperCase();

			$(btn).addClass("copied");
			window.navigator.clipboard.writeText(value);

			window.setTimeout(()=>{
				$(btn).removeClass("copied");
			}, 500);

		});
	});

    CCRDiplay();

});