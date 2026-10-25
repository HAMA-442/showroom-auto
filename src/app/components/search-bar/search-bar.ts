import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Auto } from '../../interfaces/auto';
@Component({
  imports: [FontAwesomeModule, DecimalPipe],
  selector: 'app-search-bar',
  styleUrl: './search-bar.css',
  templateUrl: './search-bar.html',
})
export class SearchBar {
  faMagnifyingGlass=faMagnifyingGlass;

  @Input() autos:Auto[]=[]
  @Output() onSelectCar=new EventEmitter<Auto>()
  selectedAutos: Auto[]=[]
  searched=false   // becomes true after the first search, to show the result count

  // list of the brands (without duplicates) for the "Choisir une marque" list
  get brands(){
    return [...new Set(this.autos.map(x => x.brand))]
  }

  // one single list (selectedAutos) is used for the cards AND for the counter
  selectAutos(brand:string, chosenBrand:string, maxPrice:string, minPower:string, sort:string){
    this.searched=true
    // an empty field means "no filter" for this criterion
    this.selectedAutos=this.autos.filter(x =>
      x.brand.toLowerCase().startsWith(brand.toLowerCase())
      && (!chosenBrand || x.brand === chosenBrand)
      && (!maxPrice || x.price <= Number(maxPrice))
      && (!minPower || x.power >= Number(minPower))
    )
    // the sort is applied on the filtered list
    if(sort === 'price-asc')   this.selectedAutos.sort((a,b) => a.price - b.price)
    if(sort === 'price-desc')  this.selectedAutos.sort((a,b) => b.price - a.price)
    if(sort === 'power-desc')  this.selectedAutos.sort((a,b) => b.power - a.power)
  }

  // empty all the fields and go back to the starting screen
  reset(brand:HTMLInputElement, chosenBrand:HTMLSelectElement, maxPrice:HTMLInputElement, minPower:HTMLInputElement, sort:HTMLSelectElement){
    brand.value=''
    chosenBrand.value=''
    maxPrice.value=''
    minPower.value=''
    sort.value=''
    this.selectedAutos=[]
    this.searched=false
  }

  selectCar(auto:Auto){
    this.onSelectCar.emit(auto)
  }
}
