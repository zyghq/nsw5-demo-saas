import { NextResponse } from "next/server";

const DEMO_WORKSPACE_ID = process.env.DEMO_WORKSPACE_ID;
const PAT = process.env.PAT;

export async function POST(request: Request) {
  const { memberId } = await request.json();
  console.log("******************* post request ********************");
  console.log(memberId);
  console.log(DEMO_WORKSPACE_ID);
  console.log(PAT);
  console.log(process.env.ZYG_API_URL);
  try {
    const memberResp = await fetch(
      `${process.env.ZYG_API_URL}/workspaces/${DEMO_WORKSPACE_ID}/members/${memberId}/`,
      {
        method: "GET",
        headers: {
          Authorization: `TOKEN ${PAT}`,
        },
      }
    );

    if (!memberResp.ok) {
      return NextResponse.json(
        { error: "authentication error" },
        { status: 401 }
      );
    }

    const memberData = await memberResp.json();
    console.log("******************* memberData ********************");
    console.log(memberData);
    console.log("******************* memberData ********************");
    const { memberId: memberIdResp, name } = memberData;

    const externalId = `cx_${memberIdResp}`;
    const customerName = `CX ${name}`;

    const body = {
      customer: {
        externalId,
        name: customerName,
      },
      create: true,
      createBy: "externalId",
    };

    const customerResp = await fetch(
      `${process.env.ZYG_API_URL}/workspaces/${DEMO_WORKSPACE_ID}/customers/tokens/`,
      {
        method: "POST",
        headers: {
          Authorization: `TOKEN ${PAT}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!customerResp.ok) {
      return NextResponse.json(
        { error: "authentication error" },
        { status: 401 }
      );
    }

    const customerData = await customerResp.json();

    const response = NextResponse.json({ ...customerData }, { status: 200 });
    return response;
  } catch (err) {
    return NextResponse.json(
      { error: "authentication error" },
      { status: 401 }
    );
  }
}
