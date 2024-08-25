$(document).ready(function(){
    // Create all variables
    const SearchField = $('#query');
    const SearchButton = $('#SearchButton');
    
    // Sldiing right animation on focus
    SearchField.on('focus', function(){
        SearchField.animate({
            width: '60%'
        },400);
        SearchButton.animate({
            left: '56%'
        },400);
    })


    // Sldiing left animation on blur
    SearchField.on('blur', function(){
        if(SearchField.val() == ''){
            SearchField.animate({
                width: '30%'
            },400,function(){});
            SearchButton.animate({
                left: '26%'
            },400, function(){});
        }
    })


    SearchButton.on('click', search);

    function search(){
        // Sending GET request to access API
        // Clear all results before searching
        $('.results').html('');
        $('.buttons').html('');

        // Get form input
        let SearchValue = SearchField.val();

        // Run get request on API
        $.get('https://www.googleapis.com/youtube/v3/search',{
            part: 'snippet, id',
            q: SearchValue,
            type: 'video',
            maxResults: 50,
            key: 'AIzaSyDbQ5ZLVEGg76k8bsKg7DyaZq7YMkPqM2M'
        }, function(data){
             var nextPageToken = data.nextPageToken;
             var prevPageToken = data.prevPageToken;

             $.each(data.items, function(i, item){
                var output = getOutput(item);
                // Displaying results in HTML
                $('.results').append(output);
             })

             // Displaying buttons in HTML
             var buttons = getButtons(prevPageToken, nextPageToken, SearchValue);

             $('#buttons').append(buttons);

        });
        
    };

    // Nextpage button
    window.nextPage = function() {

        // Storing data-token and data-query in variables
        var token = $('#nextButton').data('token');
        var query = $('#nextButton').data('query');

        // Sending GET request to access API
        // Clear all results before searching
        $('.results').html('');
        $('.buttons').html('');


        // Run get request on API
        $.get('https://www.googleapis.com/youtube/v3/search',{
            part: 'snippet, id',
            pageToken: token,
            q: query,
            type: 'video',
            maxResults: 50,
            key: 'AIzaSyDbQ5ZLVEGg76k8bsKg7DyaZq7YMkPqM2M'
        }, function(data){
             var nextPageToken = data.nextPageToken;
             var prevPageToken = data.prevPageToken;

             $.each(data.items, function(i, item){
                var output = getOutput(item);
                // Displaying results in HTML
                $('.results').append(output);
             })

             // Displaying buttons in HTML
             var buttons = getButtons(prevPageToken, nextPageToken, query);

             $('#buttons').append(buttons);

        });
    }

    // Previouspage button
    window.prevPage = function() {

        // Storing data-token and data-query in variables
        var token = $('#prevButton').data('token');
        var query = $('#prevButton').data('query');

        // Sending GET request to access API
        // Clear all results before searching
        $('.results').html('');
        $('.buttons').html('');


        // Run get request on API
        $.get('https://www.googleapis.com/youtube/v3/search',{
            part: 'snippet, id',
            pageToken: token,
            q: query,
            type: 'video',
            maxResults: 50,
            key: 'AIzaSyDbQ5ZLVEGg76k8bsKg7DyaZq7YMkPqM2M'
        }, function(data){

             var nextPageToken = data.nextPageToken;
             var prevPageToken = data.prevPageToken;



             $.each(data.items, function(i, item){
                var output = getOutput(item);
                // Displaying results in HTML
                $('.results').append(output);
             })

             // Displaying buttons in HTML
             var buttons = getButtons(prevPageToken, nextPageToken, query);

             $('#buttons').append(buttons);

        });
    }

    function getOutput(item){
        // Store all data of items in variables
        let SearchValue = SearchField.val();
        var videoID = item.id.videoId;
        var title = item.snippet.title;
        var description = item.snippet.description;
        var thumbnail = item.snippet.thumbnails.high.url;
        var channelTitle = item.snippet.channelTitle;
        var videoDate = item.snippet.publishedAt;
        // Upload date converts date in years or months from current period
        var uploadDate = moment(videoDate).fromNow();

        var output = `
        <div class="items">
            <div class="thumbnailBox">
                <a class="videoLink" target="_blank" href="https://www.youtube.com/embed/${videoID}"><img src="${thumbnail}" title="${SearchValue}" alt="No_Img"></a>
                
            </div>
            <div class="contentBox">
                <h3><a class="videoLink" target="_blank" href="https://www.youtube.com/embed/${videoID}">${title}</a></h3>
                <small>By ${channelTitle}<span> on ${uploadDate}</span></small>
                <p>${description}</p>
            </div>
        </div>
        `;

        return output;
    };

    function getButtons(prevPageToken, nextPageToken, SearchValue){

        $('#nextButton').remove();
        $('#prevButton').remove();

        if(!prevPageToken){
            var buttonOutput = `
            <div class="buttonContainer">
                <button id="nextButton" class="pagingButton" data-token="${nextPageToken}" data-query="${SearchValue}" onclick="nextPage()">Next Page</button>
            </div>
        `;
        }else{
            var buttonOutput = `
            <div class="buttonContainer">
                <button id="prevButton" class="pagingButton" data-token="${prevPageToken}" data-query="${SearchValue}" onclick="prevPage()">Prev Page</button>
            </div>
            <div class="buttonContainer">
                    <button id="nextButton" class="pagingButton" data-token="${nextPageToken}" data-query="${SearchValue}" onclick="nextPage()">Next Page</button>
            </div> 
            `;
        }

        return buttonOutput;
    };


});