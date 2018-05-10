import React, {Component} from 'react';

import $ from 'jquery';
import '../index.css';

// hold api links
const api = {
  baseUrl: 'https://dog.ceo/api/breeds/list/all',
  individualUrl: 'https://dog.ceo/api/breed/'
}

class Breeds extends Component{
  constructor(props){
    super(props);

    this.state = {
      breeds: [],
      expandedRows: [],
      secondBreeds: [],
      currentImage: '',
      allItemRows: []
    };
  }

  componentDidMount(){
    this.BreedList();
  }

  // this function calls the api and extracts all the name of the breeds
  // and pushing these names as an object through the state's array.
  // after looping through all the names, store the array through setState
  BreedList = () => {
    $.getJSON(api.baseUrl)
      .then((results) => {
        var parentObj = results['message'];
        var subKeys = Object.keys(parentObj);
        var newList = [];

        for(var i = 0; i < subKeys.length; i++){
          newList.push({name: this.capFirstLetter(subKeys[i]), id: i});
        }

        this.setState({
          breeds: newList
        })

        console.log(this.state.breeds);
      })
  }

  capFirstLetter = (s) => {
    return s.replace(/^.{1}/g, s[0].toUpperCase());
  }

  lowerFirstLetter = (s) => {
    return s.replace(/^.{1}/g, s[0].toLowerCase());
  }

  handleRowClick = (breedId) => {
    const currExpandedRows = Object.assign([], this.state.expandedRows);
    const isCurrExpanded = currExpandedRows.includes(breedId);
    const newExpandedRows = isCurrExpanded ? currExpandedRows.filter((id) => id !== breedId) : currExpandedRows.concat(breedId);
        
    this.setState({expandedRows : newExpandedRows});
  }

  // function creates a row with the passing breed name.
  // api call to get the breed's picture by utilizing the passing breed name
  // update the array through setState and push the tr/td that pertains the image next to the breed name td
  renderBreed = (breed) => {
    // when the tr is clicked, pass in the breed's id and check if the breed.id already exists in the expandedRows array.
    // if it exists, don't add it, if it doesn't exist, add it.
    const breedRows = [
      <tr onClick={() => {this.handleRowClick(breed.id)}} key={"row-data-" + breed.id}>
        <td>{breed.name}</td>
      </tr>
    ];

    if(this.state.expandedRows.includes(breed.id)){
      fetch(api.individualUrl + this.lowerFirstLetter(breed.name) + '/images/random')
        .then(results => {
          return results.json();
        }).then((data => {
          var msg = data.message;

          var index = this.state.breeds.findIndex((item) => {
            return (item.id === breed.id);
          });
          var copiedObject = Object.assign({}, this.state.breeds[index]);
          var copiedArray = Object.assign([], this.state.breeds);
          
          copiedObject.image = msg//results.message;
          copiedArray[index] = copiedObject;

          this.setState({
            breeds: copiedArray,
            currentImage: msg
          });
        }))
        breedRows.push(
          <tr key={'row-expanded-' + breed.id}>
            <td><img src={this.state.currentImage} /></td>
          </tr>
        )
    }

    console.log('being pushed');
    return breedRows;
  }

  render(){
    // iterate through all the breeds so that a tr/td is created for each breed name along with extracting/displaying it's image
    let allItemRows = [];
    
    this.state.breeds.forEach((item) => {
      const perItemRow = this.renderBreed(item);
      allItemRows = allItemRows.concat(perItemRow);
    });

    return(
      <table>
        <th>
          Breed Name
        </th>
        {allItemRows}
      </table>
    )
  }
}

export default Breeds;