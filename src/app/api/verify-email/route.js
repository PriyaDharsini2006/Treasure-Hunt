
// import { PrismaClient } from '@prisma/client';
// import { NextResponse } from 'next/server';
// import { getHint } from '../../../utils/qrGenerator';

// const prisma = new PrismaClient();

// export async function POST(request) {
//   try {
//     const { email, hintNumber } = await request.json();
//     console.log('Received data:', { email, hintNumber });
//     // Validate input
//     if (hintNumber < 1) {
//       return NextResponse.json({ 
//         success: false, 
//         message: 'Invalid hint number' 
//       }, { status: 400 });
//     }

//     // Find the user by email
//     let user = await prisma.qRCode.findUnique({
//       where: { email }
//     });

//     // If email doesn't exist in the database, return error
//     if (!user) {
//       return NextResponse.json({ 
//         success: false, 
//         message: 'Email not found in database' 
//       }, { status: 400 });
//     }

//     // Check if hint is already visited
//     if (user.visited.includes(hintNumber.toString())) {
//       return NextResponse.json({ 
//         success: true, 
//         message: 'Hint already visited' 
//       }, { status: 400 });
//     }

//     // Check prerequisites for the current hint
//     const prerequisiteHints = Array.from({ length: hintNumber - 1 }, (_, i) => (i + 1).toString());
//     const allPrerequisitesVisited = prerequisiteHints.every(hint => user.visited.includes(hint));

//     if (!allPrerequisitesVisited) {
//       return NextResponse.json({ 
//         success: false, 
//         message: `Prerequisite hints 1 through ${hintNumber - 1} must be visited before unlocking hint ${hintNumber}` 
//       }, { status: 400 });
//     }

//     // Update visited hints
//     await prisma.qRCode.update({
//       where: { email },
//       data: { 
//         visited: { 
//           push: hintNumber.toString() 
//         } 
//       }
//     });

//     // Return the hint
//     return NextResponse.json({ 
//       success: true, 
//       hint: getHint(hintNumber) 
//     });

//   } catch (error) {
//     console.error('Verification error:', error);
//     return NextResponse.json({ 
//       success: false, 
//       message: 'Internal server error' 
//     }, { status: 500 });
//   }
// }
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getHint } from '../../../utils/qrGenerator';

// Singleton Prisma Client
const prismaClientSingleton = () => {
  return new PrismaClient();
};

const globalForPrisma = globalThis;

// Use a single Prisma instance to prevent multiple client instances in development
export const prisma = globalForPrisma.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function POST(request) {
  try {
    const { email, hintNumber } = await request.json();
    console.log('Received data:', { email, hintNumber });

    // Validate input
    if (hintNumber < 1) {
      return NextResponse.json(
        { success: false, message: 'Invalid hint number' },
        { status: 400 }
      );
    }

    // Find the user by email
    let user = await prisma.qRCode.findUnique({
      where: { email },
    });

    // If email doesn't exist in the database, return error
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Email not found in database' },
        { status: 400 }
      );
    }

    // Check if hint is already visited
    if (user.visited.includes(hintNumber.toString())) {
      return NextResponse.json(
        { success: true, message: 'Hint already visited' },
        { status: 200 } // Successful response, but hint already visited
      );
    }

    // Check prerequisites for the current hint
    const prerequisiteHints = Array.from(
      { length: hintNumber - 1 },
      (_, i) => (i + 1).toString()
    );
    const allPrerequisitesVisited = prerequisiteHints.every((hint) =>
      user.visited.includes(hint)
    );

    if (!allPrerequisitesVisited) {
      return NextResponse.json(
        {
          success: false,
          message: `Prerequisite hints 1 through ${
            hintNumber - 1
          } must be visited before unlocking hint ${hintNumber}`,
        },
        { status: 400 }
      );
    }

    // Update visited hints
    await prisma.qRCode.update({
      where: { email },
      data: {
        visited: {
          push: hintNumber.toString(),
        },
      },
    });

    // Return the hint
    return NextResponse.json({
      success: true,
      hint: getHint(hintNumber),
    });

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
