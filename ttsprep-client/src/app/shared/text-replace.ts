import {TextBlock} from "../models/textBlock";
import {Word} from "../models/word";

export class TextReplace {
  // Can be used to replace a single text, chapter-wide text, or project-wide text
  textReplaceBeta(textBlock: TextBlock, words?: Word[]): TextBlock {
    // Clone referenced object to prevent unwanted behaviour while changing values
    let newTextBlock = {...textBlock}

    if (words?.length == 0) { return newTextBlock } // If empty array, end method early
    // Break up the initial modified text into separate words/characters and store them into a collection
    let modifiedTextWords = newTextBlock.modifiedText?.split(" ")

    // Replace the words in the collection with partial match, and replace
    for (let i = 0; i < modifiedTextWords!.length; i++) {
      words?.forEach((w: Word) => {
        if (modifiedTextWords![i].toLowerCase().includes(w.originalSpelling.toLowerCase())) {
          // Modify the matching part of the word, but keep the case
          let newSpelling: string = ''
          if (modifiedTextWords![i] === modifiedTextWords![i].toUpperCase()){
            // All upper case ("WORD")
            newSpelling = w.modifiedSpelling!.toUpperCase()
            modifiedTextWords![i] = modifiedTextWords![i].replace(w.originalSpelling!, newSpelling)
          }
          else if (modifiedTextWords![i][0] === modifiedTextWords![i][0].toLowerCase()) {
            // First letter lower case ("word")
            newSpelling = `${w.modifiedSpelling![0].toLowerCase()}${w.modifiedSpelling!.substring(1, w.modifiedSpelling!.length)}`
            modifiedTextWords![i] = modifiedTextWords![i].replace(w.originalSpelling!, newSpelling)
          }
          else if (modifiedTextWords![i][0] === modifiedTextWords![i][0].toUpperCase()) {
            // First letter upper case ("Word")
            newSpelling = `${w.modifiedSpelling![0].toUpperCase()}${w.modifiedSpelling!.substring(1, w.modifiedSpelling!.length)}`
            modifiedTextWords![i] = modifiedTextWords![i].replace(w.originalSpelling!, newSpelling)
          }

        }
      })
    }

    console.log(modifiedTextWords)
    let newModifiedText: string = ''

    // Reconstruct the modified text
    modifiedTextWords!.forEach((w: string) => {
      newModifiedText += w

      if (w != modifiedTextWords![modifiedTextWords!.length - 1]) {
        newModifiedText += " " // Add white space if word is not the last in the collection
      }
    })

    newTextBlock.modifiedText = newModifiedText
    return newTextBlock


  }


  textReplace(textBlock: TextBlock, words?: Word[]): TextBlock {
    // Clone referenced object to prevent unwanted behaviour while changing values
    let newTextBlock = {...textBlock}

    if (words?.length == 0) { return newTextBlock } // If empty array, end method early
    // Break up the initial modified text into separate words/characters and store them into a collection
    let modifiedTextWords = newTextBlock.modifiedText?.split(" ")

    // Replace the words in the collection with partial match, and replace
    for (let i = 0; i < modifiedTextWords!.length; i++) {
      words?.forEach((w: Word) => {
        if (modifiedTextWords![i].toLowerCase().includes(w.originalSpelling.toLowerCase())) {
          // Upper/lower case of first character of modified words won't matter when using TTS voice generators
          modifiedTextWords![i] = modifiedTextWords![i].replace(w.originalSpelling!, w.modifiedSpelling!)
        }
      })
    }

    let newModifiedText: string = ''

    // Reconstruct the modified text
    modifiedTextWords!.forEach((w: string) => {
      newModifiedText += w

      if (w != modifiedTextWords![modifiedTextWords!.length - 1]) {
        newModifiedText += " " // Add white space if word is not the last in the collection
      }
    })

    newTextBlock.modifiedText = newModifiedText
    return newTextBlock
  }

}
