// cypress/e2e/authenticated.cy.js

import { faker } from '@faker-js/faker/locale/en'

describe('Scenarios where authentication is a pre-condition', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/notes').as('getNotes')
    cy.sessionLogin()
  })
  

  it('CRUDs a note', () => {
    const noteDescription = faker.lorem.words(4)

    cy.createNote(noteDescription)
    cy.wait('@getNotes', { timeout: 20000  })

    const updatedNoteDescription = faker.lorem.words(4)
    const attachFile = true

    cy.editNote(noteDescription, updatedNoteDescription, attachFile)
    cy.wait('@getNotes', { timeout: 20000  })

    cy.deleteNote(updatedNoteDescription)
    cy.wait('@getNotes', { timeout: 20000  })
  })

  it.only('successfully submits the settings form', () => {
    cy.intercept('POST', '**/prod/billing').as('paymentRequest')

    cy.fillSettingsFormAndSubmit()

    cy.wait('@getNotes', { timeout: 20000  }); // Espera até 15 segundos pela requisição 'getNotes'
    cy.wait('@paymentRequest', { timeout: 20000  })
      .its('state')
      .should('be.equal', 'Complete')
  })
  it.only('logs out', () => {
    cy.visit('/')
    cy.wait('@getNotes')
    
    if (Cypress.config('viewportWidth') < Cypress.env('viewportWidthBreakpoint')) {
      cy.get('.navbar-toggle.collapsed')
        .should('be.visible')
        .click()
    }
    
    cy.contains('.nav a', 'Logout').click()

    cy.get('#email').should('be.visible')
  })

})

