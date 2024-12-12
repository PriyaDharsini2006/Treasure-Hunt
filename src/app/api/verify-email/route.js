
// import { prisma } from '../../../../lib/prisma';
// import { getHint } from '../../../utils/qrGenerator';
// import { NextResponse } from 'next/server';

// export async function POST(request) {
//   try {
//     // Parse request body with more robust error handling
//     let data;
//     try {
//       data = await request.json();
//     } catch (parseError) {
//       console.error('Request body parsing error:', parseError);
//       return NextResponse.json({ 
//         success: false, 
//         message: 'Invalid request body' 
//       }, { status: 400 });
//     }

//     const { email, hintNumber } = data;

//     // Comprehensive input validation
//     if (!email || typeof email !== 'string') {
//       return NextResponse.json({ 
//         success: false, 
//         message: 'Invalid email' 
//       }, { status: 400 });
//     }

//     // Validate hintNumber more flexibly
//     const parsedHintNumber = Number(hintNumber);
//     if (isNaN(parsedHintNumber) || parsedHintNumber < 1) {
//       return NextResponse.json({ 
//         success: false, 
//         message: 'Invalid hint number' 
//       }, { status: 400 });
//     }

//     console.log('Received data:', { email, hintNumber: parsedHintNumber });

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
//     if (user.visited.includes(parsedHintNumber.toString())) {
//       return NextResponse.json({ 
//         success: true, 
//         message: 'Hint already visited' 
//       }, { status: 200 });
//     }

//     // Check prerequisites for the current hint
//     const prerequisiteHints = Array.from({ length: parsedHintNumber - 1 }, (_, i) => (i + 1).toString());
//     const allPrerequisitesVisited = prerequisiteHints.every(hint => user.visited.includes(hint));
    
//     if (!allPrerequisitesVisited) {
//       return NextResponse.json({ 
//         success: false, 
//         message: `Prerequisite hints 1 through ${parsedHintNumber - 1} must be visited before unlocking hint ${parsedHintNumber}` 
//       }, { status: 400 });
//     }

//     // Update visited hints
//     await prisma.qRCode.update({
//       where: { email },
//       data: { 
//         visited: { 
//           push: parsedHintNumber.toString() 
//         } 
//       }
//     });

//     // Retrieve and return the hint
//     const hint = getHint(parsedHintNumber);
//     if (!hint) {
//       return NextResponse.json({ 
//         success: false, 
//         message: 'Hint not found' 
//       }, { status: 404 });
//     }

//     return NextResponse.json({ 
//       success: true, 
//       hint: hint 
//     });

//   } catch (error) {
//     // Comprehensive error handling
//     console.error('Unexpected verification error:', {
//       message: error.message,
//       name: error.name,
//       stack: error.stack
//     });

//     return NextResponse.json({ 
//       success: false, 
//       message: 'Internal server error',
//       ...(process.env.NODE_ENV !== 'production' && { 
//         errorDetails: error.message 
//       })
//     }, { status: 500 });
//   }
// }
import { prisma } from '../../../../lib/prisma';
import { getHint } from '../../../utils/qrGenerator';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Parse request body with more robust error handling
    let data;
    try {
      data = await request.json();
    } catch (parseError) {
      console.error('Request body parsing error:', parseError);
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid request body' 
      }, { status: 400 });
    }

    const { email, hintNumber } = data;

    // Comprehensive input validation
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid email' 
      }, { status: 400 });
    }

    // Validate hintNumber more flexibly
    const parsedHintNumber = Number(hintNumber);
    if (isNaN(parsedHintNumber) || parsedHintNumber < 1) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid hint number' 
      }, { status: 400 });
    }

    console.log('Received data:', { email, hintNumber: parsedHintNumber });

    // Find the user by email
    let user = await prisma.qRCode.findUnique({
      where: { email }
    });

    // If email doesn't exist in the database, return error
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'Email not found in database' 
      }, { status: 400 });
    }

    // Convert hint number to string for consistent comparison
    const hintNumberStr = parsedHintNumber.toString();

    // Check if hint is already visited
    if (user.visited.includes(hintNumberStr)) {
      // Retrieve the hint without updating the database
      const hint = getHint(parsedHintNumber);
      return NextResponse.json({ 
        success: true, 
        message: 'Hint already visited',
        hint: hint,
        alreadyVisited: true
      }, { status: 200 });
    }

    // Check prerequisites for the current hint
    const prerequisiteHints = Array.from({ length: parsedHintNumber - 1 }, (_, i) => (i + 1).toString());
    const allPrerequisitesVisited = prerequisiteHints.every(hint => user.visited.includes(hint));
    
    if (!allPrerequisitesVisited) {
      return NextResponse.json({ 
        success: false, 
        message: `Prerequisite hints 1 through ${parsedHintNumber - 1} must be visited before unlocking hint ${parsedHintNumber}` 
      }, { status: 400 });
    }

    // Update visited hints only if it's a new hint
    await prisma.qRCode.update({
      where: { email },
      data: { 
        visited: { 
          push: hintNumberStr 
        } 
      }
    });

    // Retrieve and return the hint
    const hint = getHint(parsedHintNumber);
    if (!hint) {
      return NextResponse.json({ 
        success: false, 
        message: 'Hint not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      hint: hint 
    });

  } catch (error) {
    // Comprehensive error handling
    console.error('Unexpected verification error:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });

    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error',
      ...(process.env.NODE_ENV !== 'production' && { 
        errorDetails: error.message 
      })
    }, { status: 500 });
  }
}