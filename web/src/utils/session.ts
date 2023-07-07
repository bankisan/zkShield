import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "zkshield-siwe"

const SESSION_OPTIONS = {
	ttl: 60 * 60 * 1, // 1 hr, matching the TTL of the Supabase token
};

export type ISession = {
	nonce?: string;
	chainId?: number;
	address?: string;
	token?: string;
};

export class Session {
	nonce?: string;
	chainId?: number;
	address?: string;
	token?: string;

	constructor(session?: ISession) {
		this.nonce = session?.nonce;
		this.chainId = session?.chainId;
		this.address = session?.address;
		this.token = session?.token;
	}

	static async fromRequest(req: NextRequest): Promise<Session> {
		const sessionCookie = req.cookies.get(COOKIE_NAME)?.value;
		if (!sessionCookie) return new Session();
		return new Session(JSON.parse(sessionCookie));
	}

	clear(res: NextResponse): Promise<void> {
		this.nonce = undefined;
		this.chainId = undefined;
		this.address = undefined;
		this.token = undefined;

		return this.persist(res);
	}

	toJSON(): ISession {
		return { nonce: this.nonce, address: this.address, chainId: this.chainId, token: this.token };
	}

	async persist(res: NextResponse): Promise<void> {
		res.cookies.set(COOKIE_NAME, JSON.stringify(this.toJSON()), { httpOnly: false, expires: new Date(Date.now() + SESSION_OPTIONS.ttl * 1000)});
	}
}
