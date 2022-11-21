
export function addToSubConcept(subConcept, key) {
  subConcept.push(key)
  return subConcept;
}

export function removeFromSubConcept(subConcept, key) {
  const iconIndex = subConcept.lastIndexOf(key)
  if (iconIndex > -1) {
    if (iconIndex === 0) {
      return []
    } else {
      subConcept.splice(iconIndex, 1)
      return subConcept
    }
  } else {
    return subConcept
  }
}