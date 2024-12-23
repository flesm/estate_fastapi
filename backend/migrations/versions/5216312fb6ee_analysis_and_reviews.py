"""analysis and reviews

Revision ID: 5216312fb6ee
Revises: 50b8639ac5b8
Create Date: 2024-12-03 19:31:50.054799

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5216312fb6ee'
down_revision: Union[str, None] = '50b8639ac5b8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('analysis',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('time_created', sa.DateTime(), nullable=False),
    sa.Column('description', sa.Text(), nullable=False),
    sa.Column('spec_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['spec_id'], ['specialist.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('specialist_review',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('time_created', sa.DateTime(), nullable=False),
    sa.Column('description', sa.Text(), nullable=False),
    sa.Column('spec_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['spec_id'], ['specialist.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('analysis_review',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('time_created', sa.DateTime(), nullable=False),
    sa.Column('description', sa.Text(), nullable=False),
    sa.Column('analysis_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['analysis_id'], ['analysis.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('analysis_review')
    op.drop_table('specialist_review')
    op.drop_table('analysis')
    # ### end Alembic commands ###
