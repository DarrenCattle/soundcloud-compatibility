// Initialize SoundCloud client
SC.initialize({
    client_id: "fbf72ebe2b5d401625948033da3aa2b2"
});

// Base url for SoundCloud
var soundcloud_url = "http://soundcloud.com/";
var soundcloud_api_url = 'https://api.soundcloud.com/tracks.json?client_id=YOUR_CLIENT_ID';

// On button click
$( "#submit" ).click(function() {
  // Make the soundcloud links from username inputs
  var soundcloud_user_1_url = soundcloud_url + $("#soundcloud_user_1").val();
  var soundcloud_user_2_url = soundcloud_url + $("#soundcloud_user_2").val();

  console.log("soundcloud_user_1_url: " + soundcloud_user_1_url);
  console.log("soundcloud_user_2_url: " + soundcloud_user_2_url);
  
  // "Resolve" the soundcloud links to get the user objects
  SC.get("/resolve", { url: soundcloud_user_1_url }, function(user_1) {
    SC.get("/resolve", { url: soundcloud_user_2_url }, function(user_2) {

      console.log(user_1.username + " has " + user_1.public_favorites_count + " favorite sound(s)");
      console.log(user_2.username + " has " + user_2.public_favorites_count + " favorite sound(s)");

      // Get the list of favorites for both users
      SC.get("/users/" + user_1.id + "/favorites", function(user_1_faves) {
        SC.get("/users/" + user_2.id + "/favorites", function(user_2_faves) {

          // Sort the tracks by track id
          user_1_faves.sort(compare_track);
          user_2_faves.sort(compare_track);

          console.log(user_1.username + "'s first favorite track is " + user_1_faves[0].title);
          console.log(user_2.username + "'s first favorite track is " + user_2_faves[0].title);

          mutual_favorites = intersect_safe(user_1_faves, user_2_faves);
          console.log(user_1.username + " and " + user_2.username + " have " 
            + mutual_favorites.length + " mutally favorited tracks");
          for (var i = 0; i < mutual_favorites.length; ++i) {
            console.log(mutual_favorites[i].title);
            var favorite_track_div = document.createElement("div");
            favorite_track_div.id = "track_" + mutual_favorites[i].id;
            SC.oEmbed(mutual_favorites[i].permalink_url, {iembed: "true"}, favorite_track_div);
            $("body").append(favorite_track_div);
          }
        });
      });
    });
  });
});

// Comparator function to sort tracks by id
function compare_track(a, b) {
    return a.id - b.id;
}


/* Copy pasta from http://stackoverflow.com/a/1885660/152295
 * finds the intersection of 
 * two arrays in a simple fashion.  
 *
 * PARAMS
 *  a - first array, must already be sorted
 *  b - second array, must already be sorted
 *
 * NOTES
 *
 *  Should have O(n) operations, where n is 
 *    n = MIN(a.length(), b.length())
 */
function intersect_safe(a, b)
{
  var ai=0, bi=0;
  var result = new Array();

  while( ai < a.length && bi < b.length )
  {
     if      (a[ai].id < b[bi].id ){ ai++; }
     else if (a[ai].id > b[bi].id ){ bi++; }
     else /* they're equal */
     {
       result.push(a[ai]);
       ai++;
       bi++;
     }
  }

  return result;
}