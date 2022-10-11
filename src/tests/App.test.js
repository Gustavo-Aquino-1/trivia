import React from 'react';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterAndRedux } from './helpers/renderWithRouterAndRedux';
import App from '../App';

describe('Testando a página de login', () => {
  it('Testa se os elemntos foram renderizados', () => {
    renderWithRouterAndRedux(<App />);
    const inputs = screen.getAllByRole('textbox');
    const btnPlay = screen.getByRole('button', { name: /play/i });
    const btnConfig = screen.getByRole('button', { name: /configurações/i });
    expect(inputs).toHaveLength(2);
    expect(btnPlay).toBeDefined();
    expect(btnConfig).toBeDefined();
  });

  it('Testa se redirecionado para as rotas certas', async () => {
    const { history } = renderWithRouterAndRedux(<App />);
    const email = screen.getByTestId('input-gravatar-email');
    const name = screen.getByTestId('input-player-name');
    const btnPlay = screen.getByRole('button', { name: /play/i });
    expect(btnPlay).toBeDefined();
    userEvent.type(email, 'robs@hotmail.com');
    userEvent.type(name, 'Robson');
    userEvent.click(btnPlay);
    await waitForElementToBeRemoved(() => screen.getByTestId('loading'));
    const { pathname } = history.location;
    expect(pathname).toBe('/game');
  });

  it('Testa a funcionalidade do botão de configurações', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    const btnConf = screen.getByRole('button', { name: /configurações/i });
    userEvent.click(btnConf);
    const { pathname } = history.location;
    expect(pathname).toBe('/settings');
  });
});

describe('Testando a página de feedback', () => {
  it('Testando se os elementos forma renderizados.', () => {
    renderWithRouterAndRedux(<App />, {
      player: {
        name: 'Robson o Cantor',
        assertions: 1,
        score: 780,
        gravatarEmail: 'robSon.gmail.com',
      },
    }, '/feedback')

    const text_feed = screen.getByTestId('feedback-text');
    const score = screen.getByTestId('feedback-total-score');
    const assertion = screen.getByTestId('feedback-total-question')
    const btnPlayAgain = screen.getByTestId('btn-play-again');
    const btnRanking = screen.getByTestId('btn-ranking');

    expect(text_feed).toBeDefined()
    expect(score).toBeDefined();
    expect(assertion).toBeDefined();
    expect(btnPlayAgain).toBeDefined();
    expect(btnRanking).toBeDefined();
  });

  it('Testando se os elementos forma renderizados.', () => {
    renderWithRouterAndRedux(<App />, {
      player: {
        name: 'Robson o Cantor',
        assertions: 4,
        score: 780,
        gravatarEmail: 'robSon.gmail.com',
      },
    }, '/feedback')
    const assertion = screen.getByTestId('feedback-total-question')

    expect(assertion).toBeDefined();
  })

  it('Testando se volta para pagina de login ao clicar no play again', () => {
    const { history } = renderWithRouterAndRedux(<App />, {
      player: {
        name: 'Robson o Cantor',
        assertions: 4,
        score: 780,
        gravatarEmail: 'robSon.gmail.com',
      },
    }, '/feedback')

    const btnPlayAgain = screen.getByTestId('btn-play-again');

    userEvent.click(btnPlayAgain);

    const { pathname } = history.location;
    expect(pathname).toBe('/')
  })

  it('Testando se volta para pagina de ranking ao clicar no ranking', () => {
    const { history } = renderWithRouterAndRedux(<App />, {
      player: {
        name: 'Robson o Cantor',
        assertions: 4,
        score: 780,
        gravatarEmail: 'robSon.gmail.com',
      },
    }, '/feedback')

    const btnRanking = screen.getByTestId('btn-ranking');

    userEvent.click(btnRanking);

    const { pathname } = history.location;
    expect(pathname).toBe('/ranking')
  })
});