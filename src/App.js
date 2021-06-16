import './App.css';
import {useState, useEffect} from 'react'
import axios from 'axios'
import RepoDetails from './RepoDetails'
import Graph from './components/Graph'

function App() {
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [repos, setRepos] = useState([])
  const [details, setDetails] = useState({})
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [languageData, setLanguageData] = useState([{}])
  
  
  useEffect(() =>{
    setRepos([])
    setDetails({})
  }, [username])

  function handleSubmit(e) {
    e.preventDefault();
    searchRepos()
  }

  function searchRepos(){
    setLoading(true)
    axios({
      method: "get",
      url: `https://api.github.com/users/${username}/repos`
    }).then(res => {
      setLoading(false);
      setRepos(res.data)

      //console.log(res.data) 
      //setLanguageData(langdata)
      var langs = res.data.map(a => a.language); // array of total languages
      makeLangArray(langs)
    })
  }

  function makeLangArray(arr){
    // this makes an array with values as indexes
    var counting = {};
    arr.forEach(function(i, idx) { 
      counting[i] = (counting[i]||0) + 1;
      //console.log(i)
    });
    //console.log(counting)

    var finalFormat = []
    for(const property in counting){
      //console.log(`${property}: ${counting[property]}`)
      finalFormat.push({'name': `${property}`, 'value': parseInt(`${counting[property]}`)  })
    }
    
    setLanguageData(finalFormat)
    // Need to get array of objects in this format:
    // [{name: 'Javascript', value: 2}, {name: 'CSS', value: 5}]
  }


  function renderRepo(repo) {
    //console.log(countLanguages(repo.language))
    return (
      <div className="row" onClick={() => getDetails(repo.name)} key={repo.id}>
        <h2 className="repo-name">
          {repo.name}
        </h2>
      </div>
    )
  }
  function getDetails(repoName){
    setDetailsLoading(true);
    axios({
      method: 'get',
      url: `https://api.github.com/repos/${username}/${repoName}`
    }).then(res => {
      setDetailsLoading(false)
      setDetails(res.data)
      //console.log(res.data)
    })
  }

  return (
    <div className="page">
       <div className="landing-page-container">
        <div className="left-side">
          <form className="form">
            <input
              className="input"
              value={username}
              placeholder="Github Username"
              onChange={e => setUsername(e.target.value)}
              />
              <button className="button" onClick={handleSubmit}>{loading ? "Searching..." : "Search"}</button>
          </form>
          <div className="results-container">
            <div>
              <Graph languages={languageData}/>
            </div>
            {repos.map(renderRepo)}
          </div>
        </div>
        <RepoDetails details={details} loading={detailsLoading} />
       </div>
    </div>
  );
}

export default App;
