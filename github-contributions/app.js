const r = R
const a = alkali
const d = d3
const f = fetch

const username = 'foundling'
const API_BASE = 'https://api.github.com' 
const PAGE_MAX = 30
const USER_ROUTE = `${API_BASE}/users/${username}` 
const USER_REPO_ROUTE = `${API_BASE}/users/${username}/repos`

// request -> JSON
const toJSON = r => r.json()

// width -> max -> [[start,end]] 
const findPageBoundaries = (width, max) => {

    let boundaries = []

    while (max >= 0) {
        let start = max - width
        boundaries.push(start)
        max -= width
    }

    return boundaries;

}

// url -> Number -> [responses]
const fetchRepos = (url, pageMax) => {

    const boundaries = findPageBoundaries(PAGE_MAX, pageMax);
    const requests = boundaries.map(start => {
        let url = `${USER_REPO_ROUTE}?page=${start})` 
        return fetch(url).then(toJSON)
    });


    return Promise.all(requests);

}

// main
f(USER_ROUTE)
    .then(toJSON)
    .then(repo => { 
        return fetchRepos(USER_REPO_ROUTE, repo.public_repos)
    })
    .then(toJSON)
    .then(console.log)
