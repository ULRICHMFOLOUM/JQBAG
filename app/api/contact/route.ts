import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Veuillez renseigner votre nom, email et message." },
        { status: 400 }
      );
    }

    const contact = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : null,
        subject: subject ? subject.trim() : "Demande générale",
        message: message.trim(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Votre message a été transmis à notre atelier. Nous vous répondrons dans les plus brefs délais.",
      contactId: contact.id,
    });
  } catch (error: any) {
    console.error("Erreur contact:", error);
    return NextResponse.json(
      { error: "Impossible d'envoyer votre message pour le moment." },
      { status: 500 }
    );
  }
}

