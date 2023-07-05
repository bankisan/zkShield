import { NextRequest, NextResponse } from "next/server";
import { sealData, unsealData } from "iron-session";

const COOKIE_NAME = "zkshield-siwe"

if (!process.env.SESSION_SECRET) {
	throw new Error("SESSION_SECRET cannot be empty.");
}

const SESSION_OPTIONS = {
	ttl: 60 * 60 * 24 * 30, // 30 days
	password: process.env.SESSION_SECRET!,
};

export type ISession = {
	nonce?: string;
	chainId?: number;
	address?: string;
};

export class Session {
	nonce?: string;
	chainId?: number;
	address?: string;

	constructor(session?: ISession) {
		this.nonce = session?.nonce;
		this.chainId = session?.chainId;
		this.address = session?.address;
	}

	static async fromRequest(req: NextRequest): Promise<Session> {
		const sessionCookie = req.cookies.get(COOKIE_NAME)?.value;

		if (!sessionCookie) return new Session();
		return new Session(
			await unsealData<ISession>(sessionCookie, SESSION_OPTIONS)
		);
	}

	clear(res: NextResponse): Promise<void> {
		this.nonce = undefined;
		this.chainId = undefined;
		this.address = undefined;

		return this.persist(res);
	}

	toJSON(): ISession {
		return { nonce: this.nonce, address: this.address, chainId: this.chainId };
	}

	async persist(res: NextResponse): Promise<void> {
		res.cookies.set(
			COOKIE_NAME,
			await sealData(this.toJSON(), SESSION_OPTIONS),
			{
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
			}
		);
	}
}
