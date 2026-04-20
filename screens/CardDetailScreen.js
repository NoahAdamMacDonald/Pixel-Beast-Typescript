import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { getCardById } from '../services/api';

export default function CardDetailScreen({ route }) {
    const { cardId, cardType } = route.params;
    const [card, setCard ] = useState(null);
    const [loading, setLoading ] = useState(true);
    const [error, setError ] = useState(null);

    useEffect(() => {
        loadingCard();
    }, [cardId, cardType]);

    const loadingCard = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getCardById(cardType, cardId);
            setCard(data);
        } catch (err) {
            setError('Failed to load card details!');
            console.error('Card detail error: ', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#533483" />
                <Text style={styles.loadingText}>Loading card...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if(!card) return null;

    const stats = card.stats;

    return(
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                {stats.image && (
                <Image
                     source={{ uri: stats.image }}
                     style={{ width: 200, height: 280, borderRadius: 12, marginBottom: 16}}
                     resizeMode="contain"
                     />
                     )}
                <Text style={styles.cardName}>{stats.name}</Text>
                <View style={styles.typeBadge}>
                    <Text style={styles.typeText}>{card.cardType}</Text>
                </View>
            </View>

            <View style={styles.statsRow}>
                <StatBox label="Play Cost" value={stats.playCost} />
                {stats.level !== undefined && <StatBox label="Level" value={stats.level}/>}
                {stats.evoCost !== undefined && <StatBox label="Evo Cost" value={stats.evoCost}/>}
                {stats.bts !== undefined && <StatBox label="BTS" value={stats.bts}/>}
            </View>

            {(stats.evoColor || stats.color) && (
                <InfoRow label="Color" value={stats.evoColor || stats.color} />
            )}

            {stats.bitEffect &&  (
                            <View style={styles.bitEffectCard}>
                            <Text style={styles.bitEffectLabel}>BitEffect</Text>
                            <Text style={styles.bitEffectText}>{stats.bitEffect}</Text>
                            </View>
                        )}

            {stats.traits && stats.traits.length > 0 && (
                <TagSection title="Traits" items={stats.traits} color="#0F3460" />
            )}

            {stats.keywords && stats.keywords.length > 0 && (
                <TagSection title="Keywords" items={stats.keywords} color="#533483" />
            )}

            {stats.restrictions && stats.restrictions.length > 0 && (
                <TagSection title="Restrictions" items={stats.restrictions} color="#8B0000" />
            )}

            {stats.effects && stats.effects.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Effects</Text>
                    {stats.effects.map((effect, index) => (
                        <View key={index} style={styles.effectCard}>
                            <Text style={styles.effectText}>{effect.text}</Text>
                            {effect.trigger && effect.trigger.length > 0 && (
                                <Text style={styles.effectMeta}>
                                    Trigger: {effect.trigger.join(', ')}
                                </Text>
                            )}
                        {effect.available && (
                            <Text style={styles.effectMeta}>Available: {effect.available}</Text>
                        )}
                    </View>
                    ))}
                </View>
            )}

            {stats.soulEffects && stats.soulEffects.length >0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Soul Effects</Text>
                    {stats.soulEffects.map((se, index) => (
                        <View key={index} style={styles.effectCard}>
                            <Text style={styles.effectText}>{se.text}</Text>
                            <Text style={styles.effectMeta}>Trigger: {se.trigger}</Text>
                            {se.available && (
                                <Text style={styles.effectMeta}>Available: {se.available}</Text>
                            )}
                            </View>
                    ))}
                </View>
            )}

            {stats.special && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Special</Text>
                    <View style={styles.effectCard}>
                        <Text style={styles.specialName}>{stats.special.name}</Text>
                        <Text style={styles.effectText}>{stats.special.text}</Text>
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

    function StatBox({ label, value }) {
        return (
            <View style={styles.statBox}>
                <Text style={styles.statValue}>{value}</Text>
                <Text style={styles.statLabel}>{label}</Text>
            </View>
        );
    }

    function InfoRow({ label, value }) {
        return (
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
            </View>
        );
    }

    function TagSection({ title, items, color }) {
        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <View style={styles.tagRow}>
                    {items.map((item, index) => (
                        <View key={index} style={[styles.tag, { backgroundColor: color }]}>
                            <Text style={styles.tagText}>{item}</Text>
                         </View>
                    ))}
                </View>
            </View>
        );
    }

    const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16213E',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    backgroundColor: '#16213E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#A0A0B0',
    marginTop: 12,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  cardName: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  typeBadge: {
    backgroundColor: '#533483',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: '#0F3460',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    minWidth: 72,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#A0A0B0',
    fontSize: 11,
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0F3460',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  infoLabel: {
    color: '#A0A0B0',
    fontSize: 14,
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  effectCard: {
    backgroundColor: '#0F3460',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  effectText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
  },
  effectMeta: {
    color: '#A0A0B0',
    fontSize: 12,
    marginTop: 6,
  },
  specialName: {
    color: '#533483',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  bitEffectCard: {
    backgroundColor: '#0F3460',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  bitEffectLabel: {
    color: '#A0A0B0',
    fontSize: 12,
    marginBottom: 6,
  },
  bitEffectText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
  }
});
