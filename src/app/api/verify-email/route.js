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
        message: 'May Be Next Time' 
      }, { status: 400 });
    }

    // Convert hint number to string for consistent comparison
    const hintNumberStr = parsedHintNumber.toString();

    // Fetch previous hints that have been visited
    const visitedHints = user.visited.filter(
      hint => Number(hint) <= parsedHintNumber
    ).map(Number).sort((a, b) => a - b);

    // Check prerequisites for the current hint
    const prerequisiteHints = Array.from({ length: parsedHintNumber - 1 }, (_, i) => (i + 1).toString());
    const allPrerequisitesVisited = prerequisiteHints.every(hint => user.visited.includes(hint));
    
    if (!allPrerequisitesVisited) {
      return NextResponse.json({ 
        success: false, 
        message: `Prerequisite hint ${parsedHintNumber - 1} must be visited before unlocking hint ${parsedHintNumber}` 
      }, { status: 400 });
    }

    // If the current hint is not already visited, update the visited hints
    if (!user.visited.includes(hintNumberStr)) {
      await prisma.qRCode.update({
        where: { email },
        data: { 
          visited: { 
            push: hintNumberStr 
          } 
        }
      });
    }

    // Retrieve hints for visited hint numbers
    const hints = visitedHints.map(num => ({
      number: num,
      text: getHint(num)
    }));

    // Retrieve the current hint
    const currentHint = getHint(parsedHintNumber);
    if (!currentHint) {
      return NextResponse.json({ 
        success: false, 
        message: 'Hint not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      hints: hints,
      currentHint: currentHint,
      visitedHintNumbers: visitedHints
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