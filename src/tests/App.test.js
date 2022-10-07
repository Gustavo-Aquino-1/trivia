import React from 'react';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App';
import userEvent from '@testing-library/user-event';

describe('Testando a página de login', () => {
    it('Testa se os elemntos foram renderizados', ()=>{
        renderWithRouterAndRedux(<App />);
        const inputs = screen.getAllByRole('textbox');
        const btnPlay = screen.getByRole('button',{name: /play/i});
        const btnConfig = screen.getByRole('button',{name: /configurações/i});
        expect(inputs).toHaveLength(2);
        expect(btnPlay).toBeInTheDocument();
        expect(btnConfig).toBeInTheDocument();
    });

    it('Testa se redirecionado para as rotas certas',async () => {
        const { history } = renderWithRouterAndRedux(<App />);
        const email = screen.getByTestId('input-gravatar-email');
        const name = screen.getByTestId('input-player-name');
        const btnPlay = screen.getByRole('button',{name: /play/i});
        expect(btnPlay).toBeInTheDocument();
        userEvent.type(email,'robs@hotmail.com');
        userEvent.type(name,'Robson');
        userEvent.click(btnPlay);
        await waitForElementToBeRemoved(() => screen.getByTestId('loading'));
        const { pathname } = history.location;
        expect(pathname).toBe('/game');
    });

    it('Testa a funcionalidade do botão de configurações', () => {
        const { history } = renderWithRouterAndRedux(<App />)
        const btnConf = screen.getByRole('button', { name: /configurações/i })
        userEvent.click(btnConf);
        const { pathname } = history.location;
        expect(pathname).toBe('/settings'); 
    });
});