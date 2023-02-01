import {fireEvent, render, screen, waitFor} from '@testing-library/react';

import App from './App';
import {mswServer} from "../tests/mswServer";
import {rest} from "msw";

describe('App', () => {
    // it('renders headline', () => {
    //     render(<App />);
    //
    //     screen.debug();
    //
    //     // check if App components renders headline
    // });
    describe('Number of Likes', () => {
        it('should show the number of likes', async () => {
            mswServer.use(rest.get('http://localhost:3001/api/v1/like/:likeId/count', (req, res,ctx)=> {
                return res(ctx.json({data: 10}))
            }))
            mswServer.use(rest.get('http://localhost:3001/api/v1/like/:likeId/user/:userId', (req, res,ctx)=> {
                return res(ctx.json({data: false}))
            }))
            render(<App/>)

            expect(await screen.findByText('10')).toBeVisible();
        })
        it('should show the number of likes shortened', async () => {
            mswServer.use(rest.get('http://localhost:3001/api/v1/like/:likeId/count', (req, res,ctx)=> {
                return res(ctx.json({data: 1433}))
            }))
            mswServer.use(rest.get('http://localhost:3001/api/v1/like/:likeId/user/:userId', (req, res,ctx)=> {
                return res(ctx.json({data: false}))
            }))

            render(<App/>)

            expect(await screen.findByText("1.4K")).toBeVisible();
        });
    })

    describe('Heart', () => {
        it('should not be filled if not liked', async () => {
            mswServer.use(rest.get('http://localhost:3001/api/v1/like/:likeId/count', (req, res,ctx)=> {
                return res(ctx.json({data: 1433}))
            }))
            mswServer.use(rest.get('http://localhost:3001/api/v1/like/:likeId/user/:userId', (req, res,ctx)=> {
                return res(ctx.json({data: false}))
            }))

            render(<App/>)

            const button = await screen.findByRole("button")

            await waitFor(() => {
                expect(button).toHaveAttribute("aria-pressed", "false");
            })
        });

        it('should be filled if liked', async () => {
            mswServer.use(rest.get('http://localhost:3001/api/v1/like/:likeId/count', (req, res,ctx)=> {
                return res(ctx.json({data: 1433}))
            }))
            mswServer.use(rest.get('http://localhost:3001/api/v1/like/:likeId/user/:userId', (req, res,ctx)=> {
                return res(ctx.json({data: true}))
            }))


            render(<App/>)

            const button = await screen.findByRole("button")

            await waitFor(() => {
                expect(button).toHaveAttribute("aria-pressed", "true");
            })
        })
    })

    describe('Like/Dislike', () => {
        it('should indicate if it is liked', async () => {
            mswServer.use(rest.get('http://localhost:3001/api/v1/like/:likeId/count', (req, res,ctx)=> {
                return res(ctx.json({data: 1}))
            }))
            mswServer.use(rest.get('http://localhost:3001/api/v1/like/:likeId/user/:userId', (req, res,ctx)=> {
                return res(ctx.json({data: false}))
            }))
            mswServer.use(rest.post('http://localhost:3001/api/v1/like/add', (req, res,ctx)=> {
                return res(ctx.json({data: {}}))
            }))

            render(<App/>)

            const button = await screen.findByRole("button")

            await waitFor(() => {
                expect(button).toHaveAttribute('aria-pressed', 'false');
            })

            fireEvent.click(button);

            await waitFor(async () => {
                expect(button).toHaveAttribute("aria-pressed", "true");
                expect(await screen.findByText('2')).toBeVisible();
            })
        })
        it('should indicate if it is disliked', async () => {
            mswServer.use(rest.get('http://localhost:3001/api/v1/like/:likeId/count', (req, res,ctx)=> {
                return res(ctx.json({data: 1}))
            }))
            mswServer.use(rest.get('http://localhost:3001/api/v1/like/:likeId/user/:userId', (req, res,ctx)=> {
                return res(ctx.json({data: true}))
            }))
            mswServer.use(rest.post('http://localhost:3001/api/v1/like/remove', (req, res,ctx)=> {
                return res(ctx.json({data: {}}))
            }))

            render(<App/>)

            const button = await screen.findByRole("button")

            await waitFor(() => {
                expect(button).toHaveAttribute('aria-pressed', 'true');
            })

            fireEvent.click(button);

            await waitFor(async () => {
                expect(button).toHaveAttribute("aria-pressed", "false");
                expect(await screen.findByText('0')).toBeVisible();
            })
        });
    })

});