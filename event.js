class SeakEvent {

    constructor(details) {
    this.name = details.name
    this.description = details.description
    this.shortDescription = details.shortDescription
    this.accessType = details.accessType 
    this.imageUrl = details.imageUrl;
    this.startDate = details.startDate 
    this.startTime = details.startTime
    this.endDate = details.endDate
    this.endTime = details.endTime 
    this.favorited = false
    }
}

export default SeakEvent

//name,description,shortDescription,accessType,imageUrl,startDate,startTime,endDate,endTime