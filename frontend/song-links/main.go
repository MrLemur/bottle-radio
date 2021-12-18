package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"regexp"
	"strings"
)

type link struct {
	Type        string `json:"type"`
	DisplayName string `json:"displayName"`
	URL         string `json:"url"`
}

func handleRequests() {
	http.HandleFunc("/", saveLinks)
	log.Fatal(http.ListenAndServe(":10000", nil))
}

// getItunesID returns the iTunes ID for a song.
// @param {string} title - The title of the song.
// @param {string} artist - The artist of the song.
// @return {string, error} - The iTunes ID for the song or and error.
func getItunesID(title string, artist string) (int32, error) {
	type result struct {
		WrapperType string `json:"wrapperType"`
		TrackID     int32  `json:"trackId"`
	}

	type resultList struct {
		ResultCount int      `json:"resultCount"`
		Results     []result `json:"results"`
	}

	searchTerm := url.QueryEscape(title + " " + artist)

	url := fmt.Sprintf("https://itunes.apple.com/search?term=%s&limit=3country=IE&entity=song&limit=5", searchTerm)
	resp, err := http.Get(url)
	if err != nil {
		return 0, err
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return 0, err
	}
	results := resultList{}
	json.Unmarshal(body, &results)

	if results.ResultCount == 0 || results.Results[0].WrapperType != "track" {
		return 0, fmt.Errorf("No results found")
	}
	return results.Results[0].TrackID, nil
}

// getSongLinks returns the links from a song from song.link website
// @param {string} title - The title of the song.
// @param {string} artist - The artist of the song.
// @return {[]byte, error} - Byte JSON of the links or an error.
func getSongLinks(title string, artist string) ([]link, error) {

	itunesID, err := getItunesID(title, artist)
	if err != nil {
		return nil, err
	}
	url := fmt.Sprintf("https://api.song.link/v1-alpha.1/links?platform=itunes&type=song&userCountry=GB&id=%d", itunesID)
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var linksJSON map[string]interface{}
	json.Unmarshal(body, &linksJSON)

	var links []link

	for name, linkData := range linksJSON["linksByPlatform"].(map[string]interface{}) {
		linkData := linkData.(map[string]interface{})
		links = append(links, link{Type: "listen", DisplayName: fixDisplayName(name), URL: linkData["url"].(string)})
	}

	return links, nil

}

// saveLinks handles the HTTP request to get song links and saves it to the local filesystem.
func saveLinks(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}
	fmt.Println(r.Header)
	query := r.URL.Query()
	title := query.Get("title")
	artist := query.Get("artist")
	links, err := getSongLinks(title, artist)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// write links to file
	file, _ := json.MarshalIndent(links, "", "  ")
	//write file to disk
	err = ioutil.WriteFile("song-links.json", file, 0644)

	fmt.Fprintf(w, "SUCCESS")
}

func main() {
	handleRequests()
}

func fixDisplayName(displayName string) string {
	regex := regexp.MustCompile("([A-Z])")
	addSpace := regex.ReplaceAllString(displayName, " $1")
	return strings.Title(addSpace)
}
