import { Component, OnInit } from '@angular/core';
import { MyPlace } from 'src/app/models/my-place';
import { PlaceResult } from 'src/app/models/place-result';
import { MyPlacesService } from 'src/app/services/my-places.service';
import { ResultsService } from 'src/app/Services/results.service';

// Connected to the index.d.ts file to override missing module import
import {} from 'googlemaps';

@Component({
  selector: 'app-my-places',
  templateUrl: './my-places.page.html',
  styleUrls: ['./my-places.page.scss'],
})

export class MyPlacesPage implements OnInit {

  // To use to easily switch between mock and API data
  // TRUE = using Google Data (so, use FALSE most of the time)
  useAPI: boolean = false;

  // Place details variable
  myPlaceArray: MyPlace[] = [];
  currentUserId: number;

  currentGooglePlaceId: string = '';
  currentPlaceDetails: PlaceResult = new PlaceResult();


  // We probably won't need this -- commented out code saves this
  // allSavedPlaces: PlaceResult[] = [];
  
  // We will use these
  myVisitedPlaces: PlaceResult[] = [];
  myUnvisitedPlaces: PlaceResult[] = [];

  // These may need to change for the API
  // myVisitedPlaces: Array<PlaceResult[]>;
  // myUnvisitedPlaces: Array<PlaceResult[]>;

  constructor(
    private placesService: MyPlacesService,
    private resultsService: ResultsService
  ) {}

  ngOnInit() {
    // Get the current userID -- will need to get this from the URL
    this.currentUserId = 4;

    // Get all myPlace results for this user
    this.findAllPlacesByUserId(this.currentUserId);
  }


  // This will be used for both mock and API data since it's pulling the user info and My Places from the backend/database
  findAllPlacesByUserId(userId) {
    this.placesService.getPlacesByUserId(userId).subscribe((result) => {
      this.myPlaceArray = result;
      console.log('My Place Results: ', this.myPlaceArray);
      //this.getSavedPlaces(this.myPlaceArray);
      this.sortSavedPlacesByUserId(this.myPlaceArray);
    });
    //console.log('Get Saved Places Result: ', this.allSavedPlaces);
    console.log('Get Visited Places Result: ', this.myVisitedPlaces);
    console.log('Get Unvisited Places Result: ', this.myUnvisitedPlaces);
  }

  // Sorts whether the place has been visited or not
  sortSavedPlacesByUserId(myPlaceArray) {

    for (let i = 0; i <= this.myPlaceArray.length - 1; i++) {
      let currentMyPlace = this.myPlaceArray[i];
      this.currentGooglePlaceId = myPlaceArray[i].googlePlaceId;

      if (currentMyPlace.visited == true) {
        // For each visited place in the array, call for the place details
        // this.getVisitedPlaceDetailsByGooglePlaceId(this.currentGooglePlaceId);

        // -- OR -- just put all in one function? (below)

        // this.resultsService
        //   .getSavedResultsByGooglePlaceId(this.currentGooglePlaceId)
        //   .subscribe((result) => {
        //     this.currentPlaceDetails = result[0];
        //     this.currentPlaceDetails.types = result[0].types[0];

        //     //saves place details to myVisitedPlaces array
        //     this.myVisitedPlaces.push(this.currentPlaceDetails);
        //   });

          let addPlace = this.getCardPlaceDetailsByGooglePlaceId(this.currentGooglePlaceId);

          this.myVisitedPlaces.push(addPlace);

      } else {
        // For each unvisited place in the array, call for the place details
        // this.getUnvisitedPlaceDetailsByGooglePlaceId(this.currentGooglePlaceId);

        // -- OR -- just put all in one function? (below)

        this.resultsService
          .getSavedResultsByGooglePlaceId(this.currentGooglePlaceId)
          .subscribe((result) => {
            this.currentPlaceDetails = result[0];
            this.currentPlaceDetails.types = result[0].types[0];
            //saves place details to myUnvisitedPlaces array
            this.myUnvisitedPlaces.push(this.currentPlaceDetails);
      });
      }
    }
  }

  
  ////////// MOCK DATA -- GET MY PLACES & DETAILS //////////

  getCardPlaceDetailsByGooglePlaceId(googlePlaceId): any {
      this.resultsService
      .getSavedResultsByGooglePlaceId(googlePlaceId)
      .subscribe((result) => {
        this.currentPlaceDetails = result[0];
        this.currentPlaceDetails.types = result[0].types[0];
        console.log("Card Results: ", this.currentPlaceDetails);
        return this.currentPlaceDetails;
      });
      return this.currentPlaceDetails;
  }

  // Gets Place Details to display on My Places VISITED cards
  getVisitedPlaceDetailsByGooglePlaceId(googlePlaceId) {
    // I think I'll need to add the useAPI boolean results toggle in here?
    if (this.useAPI == true) {
      // use API endpoints
    } else {
      // use MOCK endpoints
      this.resultsService
      .getSavedResultsByGooglePlaceId(googlePlaceId)
      .subscribe((result) => {
        this.currentPlaceDetails = result[0];
        this.currentPlaceDetails.types = result[0].types[0];

        //saves place details to myVisitedPlaces array
        this.myVisitedPlaces.push(this.currentPlaceDetails);
      });
    }
  }

  // Gets Place Details to display on My Places UNVISITED cards (aka, just Saved)
  // getUnvisitedPlaceDetailsByGooglePlaceId(googlePlaceId) {
  //   this.resultsService
  //     .getSavedResultsByGooglePlaceId(googlePlaceId)
  //     .subscribe((result) => {
  //       this.currentPlaceDetails = result[0];
  //       this.currentPlaceDetails.types = result[0].types[0];
  //       //saves place details to myUnvisitedPlaces array
  //       this.myUnvisitedPlaces.push(this.currentPlaceDetails);
  //     });
  // }

  // getSavedPlaces(myPlaceArray) {
  //   for (let i = 0; i <= myPlaceArray.length - 1; i++) {
  //     this.currentGooglePlaceId = myPlaceArray[i].googlePlaceId;
  //     //for each googlePlaceId in the array, call for the place details
  //     this.getAllPlaceDetailsByGooglePlaceId(this.currentGooglePlaceId);
  //   }
  // }

  // getAllPlaceDetailsByGooglePlaceId(googlePlaceId) {
  //   this.resultsService
  //     .getResultsByGooglePlaceId(googlePlaceId)
  //     .subscribe((result) => {
  //       this.currentPlaceDetails = result[0];
  //       this.currentPlaceDetails.open_now = result[0].opening_hours.open_now;
  //       this.allSavedPlaces.push(this.currentPlaceDetails);
  //     });
  // }
}