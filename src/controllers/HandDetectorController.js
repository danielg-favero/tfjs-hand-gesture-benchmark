export default class HandDetectorController {
    service
    view

    constructor({ service, view }) {
        this.service = service
        this.view = view
    }

    async results(img) {
      const results = await this.service.estimateHands(img)
      return results
    }

    parseResults(results) {
      const parsedResults = {
        rightScore: '',
        leftScore: '',
        hand: ''
      }
  
      if(!results || !results.handednesses || !results.handednesses.length) return parsedResults

      const handednesses = results.handednesses[0][0]
      const hand = handednesses.categoryName
      if(hand === 'Right') parsedResults.rightScore = handednesses.score
      if(hand === 'Left') parsedResults.leftScore = handednesses.score

      parsedResults.hand = hand

      return parsedResults
    }
    
    setResults(results) {
      const { leftScore, rightScore } = this.parseResults(results)
  
      if (leftScore) this.view.updateScore("camera-left-score", leftScore)
      if (rightScore) this.view.updateScore("camera-right-score", rightScore)
    }

    drawHands(results) {
      this.view.drawHands(results)
    }
}