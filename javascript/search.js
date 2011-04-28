$(document).ready(function(){
 	$('#Ssearch').keyup(function(){
        if($(this).val().length > 1 ){
		chercheSerie($(this).val());
		}
	}); 
	$('#loadingDiv')
    .hide()  // hide it initially
    .ajaxStart(function() {
        $(this).show();
    })
    .ajaxStop(function() {
        $(this).hide();
    })
;


});
function vocaleSerie(str){
    if(str.length > 1 ){
		chercheSerie(str);
	}
}

function chercheSerie(str){
    afficheloading('#resultatRechercheSerie ul');

	$.getJSON("http://api.betaseries.com/shows/search.json?key=41cf536c47ea&callback=?&title="+ str,
	function(data){
		//retireloading('#resultatRechercheSerie ul');
		$('#resultatRechercheSerie ul').empty();
		try{
		
			for (var i =   0; i < data.root.shows.length; i++) {
				$('<li id="'+ data.root.shows[i].url +'" class="resultSerie">'+ data.root.shows[i].title +'</li>').appendTo('#resultatRechercheSerie ul');

			}
			$(".resultSerie").click(function () { 
				afficheSerie($(this).attr('id'));
				afficheepisodes($(this).attr('id'));
			});
			if (data.root.shows.length==1){
				afficheSerie(data.root.shows[0].url);
				afficheepisodes(data.root.shows[0].url);
			}
		}catch(err){
		}
	});
	
}

function afficheSerie(str){
	self.location.hash = str;
	
	$.getJSON('http://api.betaseries.com/shows/display/'+ str +'.json?key=41cf536c47ea&callback=?',
	function(data){
		$('#infoSerietitle').text(data.root.show.title);
		$('#infoSeriedescription').text(data.root.show.description);
		$('#infoSeriestatus').text(data.root.show.status);
		/* $('#infoSerieurl').text(data.root.show.url) */;
		
		$('#infoSeriebanner').html('<img alt="'+ data.root.show.title  +'" src="'+ data.root.show.banner + '"/>' );
	});

}
function afficheepisodes(str){
	var ts = Math.round(new Date().getTime() / 1000);
	afficheloading('#listeEpisoes');
	$.getJSON('http://api.betaseries.com/shows/episodes/'+ str +'.json?key=41cf536c47ea&callback=?',
	function(data){
	//alert(data);
		$('#listeEpisoes').empty();
		for (var i=0; i < data.root.seasons.length; i++) {
			$('<h3>Saison '+ data.root.seasons[i].number  +'</h3><div id="s'+ data.root.seasons[i].number  +'"><ul></ul></div>').appendTo('#listeEpisoes');
			
			for (var j=0; j < data.root.seasons[i].episodes.length; j++) {
				$('<li id="'+ data.root.seasons[i].episodes[j].number +'" class="resultEpisode">' + data.root.seasons[i].episodes[j].number + " : "  + data.root.seasons[i].episodes[j].title +'</li>').appendTo('#s'+ data.root.seasons[i].number + ' ul');
				if(data.root.seasons[i].episodes[j].date > ts){
				$('#'+data.root.seasons[i].episodes[j].number).addClass('newepisode');
				}
			}
			$('#listeEpisoes > div').hide();
			$('#listeEpisoes > div:last').show();
		}
		$('#listeEpisoes h3').click(function() {
			//self.location.hash = $('#infoSerieurl').text() +'/'+  'coucou';
			self.location.hash = str +'/'+ $(this).next().attr('id') ;
			//alert($(this).next().attr('id'));
 			$(this).next().animate(
				{'height':'toggle'}, 'slow', 'easeOutBounce'
			); /**/
			
		});
		$(".resultEpisode").click(function () {
			affichesoustitre(str,$(this).attr('id'))
		});
	});
}

function affichesoustitre(serie,episode){

	var season = (episode.split('E')[0]).split('S')[1];
	var episode = episode.split('E')[1];
	afficheloading('#listeSoustitre ul');
	$.getJSON('http://api.betaseries.com/subtitles/show/'+ serie +'.json?season='+ season  +'&episode='+ episode  +'&key=41cf536c47ea&callback=?',
	function(data){
		$('#listeSoustitre ul').empty();
		for (var i=0; i < data.root.subtitles.length; i++) {
			$('<li class="resultSousTitre">'+data.root.subtitles[i].language +' <a href="'+ data.root.subtitles[i].url +'" title="'+ data.root.subtitles[i].source +'">'+ data.root.subtitles[i].file +'</a> '+ data.root.subtitles[i].source +'</li>').appendTo('#listeSoustitre ul');
		}
		if(data.root.subtitles.length==0){
			$('<li class="resultSousTitre">Pas de sous-titre disponible</li>').appendTo('#listeSoustitre ul');
		}
		
	}); 

}
function afficheloading(str){
//$(str).html('<img alt="loading..." src="images/loading.gif"/>' );
$(str).html('<progress>Chargement</progress>' );
}
function retireloading(str){
$(str).html('');
}

function comantaire(str){
    self.location.hash = str;		
}