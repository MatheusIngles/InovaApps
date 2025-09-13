# app/models.py

from datetime import datetime, timezone
from typing import Optional
import sqlalchemy as sa
import sqlalchemy.orm as so
from app import db


class Ticket(db.Model):
    __tablename__ = "ticket"

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    title: so.Mapped[Optional[str]] = so.mapped_column(sa.String(255))
    description: so.Mapped[Optional[str]] = so.mapped_column(sa.String(255))
    created_at: so.Mapped[datetime] = so.mapped_column(
        sa.DateTime, default=lambda: datetime.now(timezone.utc)
    )
    status: so.Mapped[Optional[str]] = so.mapped_column(sa.String(255))
    code: so.Mapped[Optional[str]] = so.mapped_column(sa.String(255))
    priority: so.Mapped[Optional[str]] = so.mapped_column(sa.String(255))


class Chat(db.Model):
    __tablename__ = "chat"

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    title: so.Mapped[Optional[str]] = so.mapped_column(sa.String(255))

    messages: so.WriteOnlyMapped["Message"] = so.relationship(
        back_populates="chat", cascade="all, delete-orphan"
    )


class Message(db.Model):
    __tablename__ = "message"

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    content: so.Mapped[Optional[str]] = so.mapped_column(sa.String(255))
    created_at: so.Mapped[datetime] = so.mapped_column(
        sa.DateTime, default=lambda: datetime.now(timezone.utc)
    )
    is_ai: so.Mapped[bool] = so.mapped_column(sa.Boolean, default=False)

    chat_id: so.Mapped[int] = so.mapped_column(
        sa.ForeignKey("chat.id", ondelete="CASCADE")
    )
    chat: so.Mapped["Chat"] = so.relationship(back_populates="messages")


class ApplicationSettings(db.Model):
    __tablename__ = "application_settings"

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    app_title: so.Mapped[Optional[str]] = so.mapped_column(sa.String(255))
    primary_color: so.Mapped[Optional[str]] = so.mapped_column(sa.String(255))
    secondary_color: so.Mapped[Optional[str]] = so.mapped_column(sa.String(255))
    background_color: so.Mapped[Optional[str]] = so.mapped_column(sa.String(255))
    chat_background_ground: so.Mapped[Optional[str]] = so.mapped_column(sa.String(255))
    text_font: so.Mapped[Optional[str]] = so.mapped_column(sa.String(255))
    font_size: so.Mapped[Optional[str]] = so.mapped_column(sa.String(255))
    logo_path: so.Mapped[Optional[str]] = so.mapped_column(sa.String(255))
    updated_at: so.Mapped[datetime] = so.mapped_column(
        sa.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc)
    )
